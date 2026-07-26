import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getClaims,
  fileClaim,
  getClaimById,
  updateClaimStatus
} from '../controllers/claimController.js'

const router = Router()

// All claim routes require Clerk authentication
router.use(requireAuth)

router.get('/', getClaims)
router.post('/', fileClaim)
router.get('/:id', getClaimById)
router.put('/:id/status', updateClaimStatus)

export default router
