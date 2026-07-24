import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js'

const router = Router()

// All customer routes require Clerk authentication
router.use(requireAuth)

router.get('/', getCustomers)
router.post('/', createCustomer)
router.get('/:id', getCustomerById)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

export default router
