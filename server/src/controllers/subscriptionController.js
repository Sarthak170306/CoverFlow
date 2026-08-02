import prisma from '../lib/prisma.js'
import { getAuthFromReq } from '../middleware/auth.js'

/**
 * GET /api/subscription/status
 * Returns current user's system plan and status
 */
export const getSubscriptionStatus = async (req, res) => {
  try {
    const authObj = getAuthFromReq(req)
    const clerkUserId = authObj?.userId || req.user?.id

    if (clerkUserId) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ clerkId: clerkUserId }, { id: clerkUserId }]
        }
      })

      if (user) {
        return res.status(200).json({
          plan: 'Starter',
          status: 'active',
          cycle: 'monthly',
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
    }

    return res.status(200).json({
      plan: 'Starter',
      status: 'active',
      cycle: 'monthly',
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
