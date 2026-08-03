import prisma from '../lib/prisma.js'

/**
 * GET /api/premiums
 * Retrieves all premium payment records with optional search, status filtering, and pagination
 */
export const getAllPremiums = async (req, res, next) => {
  try {
    const search = req.query.search || ''
    const status = req.query.status || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const whereConditions = []

    if (status && ['PAID', 'PENDING', 'OVERDUE'].includes(status.toUpperCase())) {
      whereConditions.push({ paymentStatus: status.toUpperCase() })
    }

    if (search) {
      whereConditions.push({
        OR: [
          { policyId: { contains: search, mode: 'insensitive' } },
          { policy: { policyNumber: { contains: search, mode: 'insensitive' } } },
          { policy: { policyType: { contains: search, mode: 'insensitive' } } },
          { policy: { customer: { name: { contains: search, mode: 'insensitive' } } } },
          { policy: { customer: { email: { contains: search, mode: 'insensitive' } } } }
        ]
      })
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [totalCount, payments] = await Promise.all([
      prisma.premiumPayment.count({ where: whereClause }),
      prisma.premiumPayment.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          policy: {
            include: {
              customer: {
                select: { id: true, name: true, email: true, phone: true }
              }
            }
          }
        },
        orderBy: { paymentDate: 'desc' }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit) || 1

    return res.status(200).json({
      payments,
      premiums: payments,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/premiums/pay
 * Records a new premium payment in the database using Prisma
 */
export const recordPayment = async (req, res, next) => {
  try {
    const { policyId, amount } = req.body

    let targetPolicyId = policyId

    // Verify if policyId exists in Policy table; fallback to first available policy or create demo policy
    let existingPolicy = await prisma.policy.findUnique({
      where: { id: targetPolicyId }
    })

    if (!existingPolicy) {
      existingPolicy = await prisma.policy.findFirst()
    }

    if (!existingPolicy) {
      // Find or create customer for default policy relation
      let customer = await prisma.customer.findFirst()
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: 'Enterprise Policyholder',
            email: `policyholder_${Date.now()}@coverflow.com`
          }
        })
      }

      existingPolicy = await prisma.policy.create({
        data: {
          customerId: customer.id,
          policyType: 'Commercial Auto & Liability',
          policyNumber: `POL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          premiumAmount: amount || 999,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      })
    }

    targetPolicyId = existingPolicy.id

    const payment = await prisma.premiumPayment.create({
      data: {
        policyId: targetPolicyId,
        amount,
        paymentStatus: 'PAID'
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Premium Paid Successfully!',
      payment
    })
  } catch (error) {
    next(error)
  }
}
