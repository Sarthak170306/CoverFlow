import prisma from '../lib/prisma.js'

/**
 * Helper to get Auth object safely from req (supports function req.auth() & object req.auth)
 */
export const getAuthFromReq = (req) => {
  if (typeof req.auth === 'function') {
    return req.auth()
  }
  return req.auth || {}
}

/**
 * Middleware to ensure the request is authenticated via Clerk
 */
export const requireAuth = (req, res, next) => {
  const auth = getAuthFromReq(req)
  if (!auth || !auth.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token or session missing'
    })
  }
  next()
}

/**
 * Middleware to fetch and attach database User context (req.dbUser)
 */
export const attachDbUser = async (req, res, next) => {
  try {
    const auth = getAuthFromReq(req)
    if (auth && auth.userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: auth.userId },
        include: { customer: true }
      })
      req.dbUser = user || null
    }
    next()
  } catch (error) {
    console.error('Error attaching database user context:', error)
    next(error)
  }
}
