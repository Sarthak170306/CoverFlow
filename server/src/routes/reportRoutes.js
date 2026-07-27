import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { exportClaimsCSV, exportPremiumsCSV } from '../controllers/reportController.js'

const router = Router()

// All report routes require Clerk authentication
router.use(requireAuth)

router.get('/claims/csv', exportClaimsCSV)
router.get('/premiums/csv', exportPremiumsCSV)

export default router
