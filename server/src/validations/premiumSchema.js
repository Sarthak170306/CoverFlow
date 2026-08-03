import { z } from 'zod'

/**
 * Zod schema validating Premium Payment payload
 */
export const premiumSchema = z.object({
  policyId: z
    .string({ required_error: 'Policy ID is required' })
    .min(1, 'Policy ID cannot be empty'),
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be a positive number')
})
