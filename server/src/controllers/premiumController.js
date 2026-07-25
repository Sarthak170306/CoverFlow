import prisma from '../lib/prisma.js'

/**
 * Helper to auto-generate transaction reference ID if not provided
 */
const generateTransactionId = () => {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return `TXN-${year}-${randomNum}`
}

/**
 * GET /api/premiums
 * Fetches all premium payment records with status filter, search, and pagination
 */
export const getPremiumPayments = async (req, res) => {
  try {
    const status = req.query.status || ''
    const search = req.query.search || ''
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
          { transactionId: { contains: search, mode: 'insensitive' } },
          { paymentMethod: { contains: search, mode: 'insensitive' } },
          { policy: { policyNumber: { contains: search, mode: 'insensitive' } } },
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
            select: {
              id: true,
              policyNumber: true,
              policyType: true,
              status: true,
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
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching premium payments:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/premiums
 * Records a new premium payment for a policy
 */
export const createPremiumPayment = async (req, res) => {
  try {
    const { policyId, amount, paymentDate, paymentMethod, status, paymentStatus, transactionId } = req.body

    if (!policyId || !amount) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'policyId and amount are required'
      })
    }

    // Verify policy exists
    const policy = await prisma.policy.findUnique({ where: { id: policyId } })
    if (!policy) {
      return res.status(404).json({ error: 'Not Found', message: 'Target policy not found' })
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'amount must be a positive number' })
    }

    const parsedPaymentDate = paymentDate ? new Date(paymentDate) : new Date()
    if (isNaN(parsedPaymentDate.getTime())) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid paymentDate format' })
    }

    const finalStatus = status || paymentStatus || 'PAID'
    const finalTxnId = transactionId && transactionId.trim() ? transactionId.trim() : generateTransactionId()

    const payment = await prisma.premiumPayment.create({
      data: {
        policyId,
        amount: parsedAmount,
        paymentDate: parsedPaymentDate,
        paymentStatus: finalStatus,
        paymentMethod: paymentMethod || 'BANK_TRANSFER',
        transactionId: finalTxnId
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
      message: 'Premium payment recorded successfully',
      payment
    })
  } catch (error) {
    console.error('Error recording premium payment:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/premiums/policy/:policyId
 * Fetches all payment history for a specific policy
 */
export const getPaymentsByPolicyId = async (req, res) => {
  try {
    const { policyId } = req.params

    const payments = await prisma.premiumPayment.findMany({
      where: { policyId },
      include: {
        policy: {
          select: { id: true, policyNumber: true, policyType: true }
        }
      },
      orderBy: { paymentDate: 'desc' }
    })

    return res.status(200).json({ payments })
  } catch (error) {
    console.error('Error fetching payments for policy:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * PUT /api/premiums/:id/status
 * Updates payment status (PAID, PENDING, OVERDUE)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, paymentStatus } = req.body

    const targetStatus = status || paymentStatus

    if (!targetStatus || !['PAID', 'PENDING', 'OVERDUE'].includes(targetStatus.toUpperCase())) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Valid status (PAID, PENDING, or OVERDUE) is required'
      })
    }

    const existingPayment = await prisma.premiumPayment.findUnique({ where: { id } })
    if (!existingPayment) {
      return res.status(404).json({ error: 'Not Found', message: 'Premium payment record not found' })
    }

    const updatedPayment = await prisma.premiumPayment.update({
      where: { id },
      data: {
        paymentStatus: targetStatus.toUpperCase()
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
      message: 'Payment status updated successfully',
      payment: updatedPayment
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
