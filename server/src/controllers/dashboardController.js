import prisma from '../lib/prisma.js'

/**
 * GET /api/dashboard/stats
 * Aggregates core KPI statistics and combined recent activity feed
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      activePolicies,
      revenueAggregate,
      pendingClaims,
      recentClaims,
      recentPayments
    ] = await Promise.all([
      // Total customers count
      prisma.customer.count(),

      // Active policies count
      prisma.policy.count({ where: { status: 'ACTIVE' } }),

      // Total revenue from PAID premium payments
      prisma.premiumPayment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'PAID' }
      }),

      // Pending claims count
      prisma.claim.count({ where: { status: 'PENDING' } }),

      // Recent 5 claims
      prisma.claim.findMany({
        take: 5,
        orderBy: { submissionDate: 'desc' },
        include: {
          policy: {
            select: {
              policyNumber: true,
              policyType: true,
              customer: { select: { id: true, name: true, email: true } }
            }
          }
        }
      }),

      // Recent 5 premium payments
      prisma.premiumPayment.findMany({
        take: 5,
        orderBy: { paymentDate: 'desc' },
        include: {
          policy: {
            select: {
              policyNumber: true,
              policyType: true,
              customer: { select: { id: true, name: true, email: true } }
            }
          }
        }
      })
    ])

    const totalRevenue = revenueAggregate._sum.amount || 0

    // Combine recent claims and payments into a unified activity feed
    const formattedClaims = recentClaims.map((c) => ({
      id: `claim-${c.id}`,
      rawId: c.id,
      type: 'CLAIM',
      title: `Claim Filed (#CLM-${c.id.substring(0, 8).toUpperCase()})`,
      description: c.reason,
      amount: c.claimAmount,
      status: c.status,
      date: c.submissionDate,
      policyNumber: c.policy?.policyNumber || 'N/A',
      customerName: c.policy?.customer?.name || 'Policyholder'
    }))

    const formattedPayments = recentPayments.map((p) => ({
      id: `pmt-${p.id}`,
      rawId: p.id,
      type: 'PAYMENT',
      title: `Premium Received (${p.transactionId || `TXN-${p.id.substring(0, 8).toUpperCase()}`})`,
      description: `Method: ${p.paymentMethod || 'Bank Transfer'}`,
      amount: p.amount,
      status: p.paymentStatus,
      date: p.paymentDate,
      policyNumber: p.policy?.policyNumber || 'N/A',
      customerName: p.policy?.customer?.name || 'Policyholder'
    }))

    const recentActivity = [...formattedClaims, ...formattedPayments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return res.status(200).json({
      stats: {
        totalCustomers,
        activePolicies,
        totalRevenue,
        pendingClaims
      },
      recentActivity
    })
  } catch (error) {
    console.error('Error calculating dashboard analytics:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
