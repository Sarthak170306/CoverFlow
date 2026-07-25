import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getPolicies,
  createPolicy,
  getPolicyById,
  renewPolicy,
  cancelPolicy
} from '../controllers/policyController.js'

const router = Router()

// All policy routes require Clerk authentication
router.use(requireAuth)

router.get('/', getPolicies)
router.post('/', createPolicy)
router.get('/:id', getPolicyById)
router.put('/:id/renew', renewPolicy)
router.put('/:id/cancel', cancelPolicy)

export default router
