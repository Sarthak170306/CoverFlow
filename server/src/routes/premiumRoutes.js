import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getPremiumPayments,
  createPremiumPayment,
  getPaymentsByPolicyId,
  updatePaymentStatus
} from '../controllers/premiumController.js'

const router = Router()

// All premium payment routes require Clerk authentication
router.use(requireAuth)

router.get('/', getPremiumPayments)
router.post('/', createPremiumPayment)
router.get('/policy/:policyId', getPaymentsByPolicyId)
router.put('/:id/status', updatePaymentStatus)

export default router
