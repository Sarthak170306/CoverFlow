import prisma from '../lib/prisma.js'

/**
 * GET /api/policies
 * Retrieves all policies
 */
export const getPolicies = async (req, res) => {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        _count: { select: { claims: true, payments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json({ policies })
  } catch (error) {
    console.error('Error fetching policies:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/policies
 * Creates a new policy for a customer
 */
export const createPolicy = async (req, res) => {
  try {
    const { customerId, policyType, policyNumber, premiumAmount, startDate, endDate, status } = req.body

    if (!customerId || !policyType || !policyNumber || !premiumAmount || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'customerId, policyType, policyNumber, premiumAmount, startDate, and endDate are required'
      })
    }

    const policy = await prisma.policy.create({
      data: {
        customerId,
        policyType,
        policyNumber,
        premiumAmount: parseFloat(premiumAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(status && { status })
      },
      include: {
        customer: { select: { id: true, name: true, email: true } }
      }
    })

    return res.status(201).json({ message: 'Policy created successfully', policy })
  } catch (error) {
    console.error('Error creating policy:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Conflict', message: 'Policy with this policyNumber already exists' })
    }
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/policies/:id
 * Retrieves details for a single policy
 */
export const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        customer: true,
        claims: true,
        payments: true
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
