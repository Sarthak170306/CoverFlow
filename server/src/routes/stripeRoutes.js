import express, { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhook
} from '../controllers/stripeController.js'

const router = Router()

// Public Webhook Route (CRITICAL: Uses express.raw for cryptographic verification, exempt from Clerk auth)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

// Protected Stripe Routes (Requires Clerk Authentication)
router.post('/create-checkout-session', requireAuth, createCheckoutSession)
router.post('/create-portal-session', requireAuth, createPortalSession)

export default router
