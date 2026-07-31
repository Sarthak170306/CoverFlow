import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import authRoutes from './src/routes/authRoutes.js'
import customerRoutes from './src/routes/customerRoutes.js'
import policyRoutes from './src/routes/policyRoutes.js'
import premiumRoutes from './src/routes/premiumRoutes.js'
import claimRoutes from './src/routes/claimRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'
import reportRoutes from './src/routes/reportRoutes.js'
import settingRoutes from './src/routes/settingRoutes.js'
import subscriptionRoutes from './src/routes/subscriptionRoutes.js'
import stripeRoutes from './src/routes/stripeRoutes.js'
import { handleWebhook } from './src/controllers/stripeController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Core Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

// CRITICAL: Public Stripe Webhook route with raw body parser BEFORE express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleWebhook)

// Global body parser & Clerk auth middleware for API routes
app.use(express.json())
app.use(clerkMiddleware())

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    message: 'CoverFlow API is running smoothly',
    timestamp: new Date().toISOString()
  })
})

// API Modular Routes
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/policies', policyRoutes)
app.use('/api/premiums', premiumRoutes)
app.use('/api/claims', claimRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/stripe', stripeRoutes)

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err)
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 CoverFlow API Server running on port ${PORT}`)
})
