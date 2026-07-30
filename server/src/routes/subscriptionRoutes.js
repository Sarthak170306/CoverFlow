import { Router } from 'express'
import { getSubscriptionStatus } from '../controllers/subscriptionController.js'

const router = Router()

// Public subscription status endpoint for easy client & REST testing
router.get('/status', getSubscriptionStatus)

export default router
