import { Router } from 'express'
import { getHealthStatus } from '../controllers/settingController.js'

const router = Router()

// Public health check route
router.get('/health', getHealthStatus)

export default router
