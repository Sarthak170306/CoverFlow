import { Router } from 'express'
import { recordPayment, getAllPremiums } from '../controllers/premiumController.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { premiumSchema } from '../validations/premiumSchema.js'

const router = Router()

/**
 * GET /api/premiums
 * Fetches all premium payments with search, status filtering, and pagination
 */
router.get('/', getAllPremiums)

/**
 * POST /api/premiums/pay
 * Validates request body with premiumSchema and records payment in database
 */
router.post('/pay', validateRequest(premiumSchema), recordPayment)

export default router
