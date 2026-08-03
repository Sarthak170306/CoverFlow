/**
 * Global Error Handling Middleware
 * Catches errors passed from controllers via next(err) and formats clean JSON error responses
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 400
  const message = err.message || 'An unexpected error occurred'

  console.error(`❌ [Error Handler] ${req.method} ${req.originalUrl}:`, message)

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}
