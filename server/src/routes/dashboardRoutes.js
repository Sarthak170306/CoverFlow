import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getDashboardStats } from '../controllers/dashboardController.js'

const router = Router()

// All dashboard routes require Clerk authentication
router.use(requireAuth)

router.get('/stats', getDashboardStats)

export default router
