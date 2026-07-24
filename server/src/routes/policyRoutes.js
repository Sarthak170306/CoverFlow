import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getPolicies, createPolicy, getPolicyById } from '../controllers/policyController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getPolicies)
router.post('/', createPolicy)
router.get('/:id', getPolicyById)

export default router
