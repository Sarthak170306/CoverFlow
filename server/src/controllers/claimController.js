import prisma from '../lib/prisma.js'

/**
 * GET /api/claims
 * Retrieves claims with optional status filtering, search by claim/policy number/customer name, and pagination
 */
export const getClaims = async (req, res, next) => {
  try {
    const status = req.query.status || ''
    const search = req.query.search || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const whereConditions = []

    if (status && ['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
      whereConditions.push({ status: status.toUpperCase() })
    }

    if (search) {
      whereConditions.push({
        OR: [
          { reason: { contains: search, mode: 'insensitive' } },
          { policy: { policyNumber: { contains: search, mode: 'insensitive' } } },
          { policy: { customer: { name: { contains: search, mode: 'insensitive' } } } }
        ]
      })
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [totalCount, claims] = await Promise.all([
      prisma.claim.count({ where: whereClause }),
      prisma.claim.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          policy: {
            include: {
              customer: { select: { id: true, name: true, email: true } }
            }
          }
        },
        orderBy: { submissionDate: 'desc' }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit) || 1

    return res.status(200).json({
      claims,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    next(error)
  }
}

/**
 * POST /api/claims
 * Files a First Notice of Loss (FNOL) claim for a policy
 */
export const fileClaim = async (req, res, next) => {
  try {
    const { policyId, claimAmount, reason } = req.body

    if (!policyId || !claimAmount || !reason) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'policyId, claimAmount, and reason are required'
      })
    }

    const parsedAmount = parseFloat(claimAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'claimAmount must be a positive number' })
    }

    const policy = await prisma.policy.findUnique({ where: { id: policyId } })
    if (!policy) {
      return res.status(404).json({ error: 'Not Found', message: 'Target policy not found' })
    }

    const claim = await prisma.claim.create({
      data: {
        policyId,
        claimAmount: parsedAmount,
        reason: reason.trim(),
        status: 'PENDING'
      },
      include: {
        policy: {
          include: {
            customer: { select: { id: true, name: true, email: true } }
          }
        }
      }
    })

    return res.status(201).json({
      message: 'Claim submitted successfully',
      claim
    })
  } catch (error) {
    console.error('Error filing claim:', error)
    next(error)
  }
}

/**
 * GET /api/claims/:id
 * Retrieves details for a single claim
 */
export const getClaimById = async (req, res, next) => {
  try {
    const { id } = req.params

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        policy: {
          include: {
            customer: true,
            premiumPayments: true
          }
        }
      }
    })

    if (!claim) {
      return res.status(404).json({ error: 'Not Found', message: 'Claim record not found' })
    }

    return res.status(200).json({ claim })
  } catch (error) {
    console.error('Error fetching claim details:', error)
    next(error)
  }
}

/**
 * PUT /api/claims/:id/status
 * Updates the status of a claim (PENDING -> VERIFIED -> APPROVED / REJECTED)
 */
export const updateClaimStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Status must be one of PENDING, VERIFIED, APPROVED, or REJECTED'
      })
    }

    const existingClaim = await prisma.claim.findUnique({ where: { id } })
    if (!existingClaim) {
      return res.status(404).json({ error: 'Not Found', message: 'Claim not found' })
    }

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        status: status.toUpperCase()
      },
      include: {
        policy: {
          include: {
            customer: { select: { id: true, name: true, email: true } }
          }
        }
      }
    })

    return res.status(200).json({
      message: 'Claim status updated successfully',
      claim: updatedClaim
    })
  } catch (error) {
    console.error('Error updating claim status:', error)
    next(error)
  }
}
