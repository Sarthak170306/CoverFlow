import prisma from '../lib/prisma.js'

/**
 * Helper to auto-generate a unique policy number if not supplied
 */
const generatePolicyNumber = () => {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return `POL-${year}-${randomNum}`
}

/**
 * GET /api/policies
 * Retrieves all policies with status filtering, search by policy number/type/customer name, and pagination
 */
export const getPolicies = async (req, res) => {
  try {
    const status = req.query.status || ''
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const whereConditions = []

    if (status && ['ACTIVE', 'EXPIRED', 'CANCELLED'].includes(status.toUpperCase())) {
      whereConditions.push({ status: status.toUpperCase() })
    }

    if (search) {
      whereConditions.push({
        OR: [
          { policyNumber: { contains: search, mode: 'insensitive' } },
          { policyType: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { customer: { email: { contains: search, mode: 'insensitive' } } }
        ]
      })
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [totalCount, policies] = await Promise.all([
      prisma.policy.count({ where: whereClause }),
      prisma.policy.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          customer: {
            select: { id: true, name: true, email: true, phone: true }
          },
          _count: {
            select: { claims: true, payments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit) || 1

    return res.status(200).json({
      policies,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching policies:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/policies
 * Creates a new policy linked to a customer
 */
export const createPolicy = async (req, res) => {
  try {
    const { customerId, policyType, policyNumber, premiumAmount, startDate, endDate, status } = req.body

    if (!customerId || !policyType || !premiumAmount || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'customerId, policyType, premiumAmount, startDate, and endDate are required'
      })
    }

    // Ensure customer exists
    const customer = await prisma.customer.findUnique({ where: { id: customerId } })
    if (!customer) {
      return res.status(404).json({ error: 'Not Found', message: 'Target customer not found' })
    }

    const parsedPremium = parseFloat(premiumAmount)
    if (isNaN(parsedPremium) || parsedPremium <= 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'premiumAmount must be a positive number' })
    }

    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid start or end date format' })
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ error: 'Bad Request', message: 'End date must be after start date' })
    }

    const finalPolicyNumber = policyNumber && policyNumber.trim() ? policyNumber.trim() : generatePolicyNumber()

    const policy = await prisma.policy.create({
      data: {
        customerId,
        policyType,
        policyNumber: finalPolicyNumber,
        premiumAmount: parsedPremium,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: status || 'ACTIVE'
      },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } }
      }
    })

    return res.status(201).json({
      message: 'Policy created successfully',
      policy
    })
  } catch (error) {
    console.error('Error creating policy:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Conflict', message: 'A policy with this policyNumber already exists' })
    }
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/policies/:id
 * Retrieves details for a single policy with customer info, claims, and payments
 */
export const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        customer: true,
        claims: {
          orderBy: { submissionDate: 'desc' }
        },
        payments: {
          orderBy: { paymentDate: 'desc' }
        }
      }
    })

    if (!policy) {
      return res.status(404).json({ error: 'Not Found', message: 'Policy not found' })
    }

    return res.status(200).json({ policy })
  } catch (error) {
    console.error('Error fetching policy by ID:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * PUT /api/policies/:id/renew
 * Renews policy by extending end date and setting status to ACTIVE
 */
export const renewPolicy = async (req, res) => {
  try {
    const { id } = req.params
    const { endDate } = req.body

    if (!endDate) {
      return res.status(400).json({ error: 'Bad Request', message: 'New endDate is required for policy renewal' })
    }

    const parsedEndDate = new Date(endDate)
    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid endDate format' })
    }

    const existingPolicy = await prisma.policy.findUnique({ where: { id } })
    if (!existingPolicy) {
      return res.status(404).json({ error: 'Not Found', message: 'Policy not found' })
    }

    if (parsedEndDate <= new Date(existingPolicy.startDate)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Renewal end date must be after original start date' })
    }

    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: {
        endDate: parsedEndDate,
        status: 'ACTIVE'
      },
      include: {
        customer: { select: { id: true, name: true, email: true } }
      }
    })

    return res.status(200).json({
      message: 'Policy renewed successfully',
      policy: updatedPolicy
    })
  } catch (error) {
    console.error('Error renewing policy:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * PUT /api/policies/:id/cancel
 * Cancels a policy by setting its status to CANCELLED
 */
export const cancelPolicy = async (req, res) => {
  try {
    const { id } = req.params

    const existingPolicy = await prisma.policy.findUnique({ where: { id } })
    if (!existingPolicy) {
      return res.status(404).json({ error: 'Not Found', message: 'Policy not found' })
    }

    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      },
      include: {
        customer: { select: { id: true, name: true, email: true } }
      }
    })

    return res.status(200).json({
      message: 'Policy cancelled successfully',
      policy: updatedPolicy
    })
  } catch (error) {
    console.error('Error cancelling policy:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
