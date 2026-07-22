import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CoverFlow API',
    timestamp: new Date().toISOString()
  })
})

// Protected test route example
app.get('/api/protected', (req, res) => {
  const { userId } = req.auth
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized access' })
  }
  res.json({ message: 'Authenticated endpoint accessed', userId })
})

app.listen(PORT, () => {
  console.log(`🚀 CoverFlow API Server running on port ${PORT}`)
})
