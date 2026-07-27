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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Core Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(clerkMiddleware())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CoverFlow API',
    version: '1.0.0',
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
