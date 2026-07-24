import prisma from '../lib/prisma.js'
import { getAuthFromReq } from '../middleware/auth.js'

/**
 * POST /api/auth/sync
 * Syncs the authenticated Clerk user into the Prisma database.
 */
export const syncUser = async (req, res) => {
  try {
    const auth = getAuthFromReq(req)
    const userId = auth?.userId
    const { email, name, role } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No Clerk userId found in session' })
    }

    if (!email) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email is required for syncing user' })
    }

    // Upsert User record
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        ...(name && { name }),
        ...(role && { role })
      },
      create: {
        clerkId: userId,
        email,
        name: name || '',
        role: role || 'CUSTOMER'
      },
      include: {
        customer: true
      }
    })

    return res.status(200).json({
      message: 'User synchronized successfully',
      user
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated database user profile
 */
export const getMe = async (req, res) => {
  try {
    const auth = getAuthFromReq(req)
    const userId = auth?.userId

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { customer: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User record not synced yet' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}
