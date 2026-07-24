import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getCustomers, createCustomer, getCustomerById } from '../controllers/customerController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getCustomers)
router.post('/', createCustomer)
router.get('/:id', getCustomerById)

export default router
