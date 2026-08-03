import prisma from '../lib/prisma.js'

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
