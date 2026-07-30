import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createCheckoutSession } from '../controllers/stripeController.js'

const router = Router()

// Protected by Clerk authentication
router.use(requireAuth)

router.post('/create-checkout-session', createCheckoutSession)

export default router
