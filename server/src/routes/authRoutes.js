import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { syncUser, getMe } from '../controllers/authController.js'

const router = Router()

router.post('/sync', requireAuth, syncUser)
router.get('/me', requireAuth, getMe)

export default router
