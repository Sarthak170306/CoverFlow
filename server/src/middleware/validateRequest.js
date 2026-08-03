import { ZodError } from 'zod'

/**
 * Zod Request Validation Middleware
 * Accepts a Zod schema and parses req.body before proceeding to controller
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error.name === 'ZodError' || error instanceof ZodError) {
        const errorList = error.errors || error.issues || []
        const joinedMessages = errorList.map((err) => err.message).join(', ')
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: joinedMessages || 'Validation Error'
        })
      }
      next(error)
    }
  }
}
