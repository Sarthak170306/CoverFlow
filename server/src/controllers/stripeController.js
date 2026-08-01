import Stripe from 'stripe'

// Initialize Stripe SDK instance with environment secret key if available
const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (secretKey && secretKey.startsWith('sk_')) {
    return new Stripe(secretKey)
  }
  return null
}

/**
 * POST /api/stripe/create-checkout-session
 * Initializes a Stripe checkout session using priceId or plan parameters
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, plan = 'Pro Enterprise', cycle = 'monthly' } = req.body
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const stripe = getStripeInstance()

    // If Stripe Secret Key is configured, initialize real Stripe Checkout Session
    if (stripe) {
      let lineItems = []

      if (priceId && priceId.startsWith('price_')) {
        lineItems = [{ price: priceId, quantity: 1 }]
      } else {
        // Fallback dynamic price_data construction
        const isAnnual = cycle === 'annual'
        let unitAmount = 1900 // $19.00 default for Pro Monthly

        if (plan === 'Carrier Enterprise') {
          unitAmount = isAnnual ? 7900 : 9900 // $79 or $99
        } else {
          unitAmount = isAnnual ? 1500 : 1900 // $15 or $19
        }

        lineItems = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `CoverFlow ${plan} Plan`,
                description: `Enterprise Insurance SaaS - ${cycle.toUpperCase()} Billing`
              },
              unit_amount: unitAmount,
              recurring: {
                interval: isAnnual ? 'year' : 'month'
              }
            },
            quantity: 1
          }
        ]
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'subscription',
        success_url: `${clientUrl}/settings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/pricing?payment=cancelled`
      })

      return res.status(200).json({ url: session.url })
    }

    // Fallback Mock URL for development/demo testing when secret key is not configured
    const mockSessionUrl = `${clientUrl}/settings?payment=success&plan=${encodeURIComponent(plan)}&cycle=${cycle}`
    return res.status(200).json({ url: mockSessionUrl })
  } catch (error) {
    console.error('❌ Stripe API Error [create-checkout-session]:', error)
    return res.status(error.statusCode || 400).json({
      error: error.type || 'StripeAPIError',
      message: error.message || 'Failed to create Stripe checkout session'
    })
  }
}

/**
 * POST /api/stripe/create-portal-session
 * Initializes a Stripe Billing Portal session for managing customer subscriptions & payment methods
 */
export const createPortalSession = async (req, res) => {
  try {
    const { customerId = 'cus_dummy123' } = req.body
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const stripe = getStripeInstance()

    if (stripe) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${clientUrl}/settings`
      })

      return res.status(200).json({ url: portalSession.url })
    }

    // Fallback Mock Portal URL for development/demo testing
    const mockPortalUrl = `${clientUrl}/settings?portal=active&customer=${encodeURIComponent(customerId)}`
    return res.status(200).json({ url: mockPortalUrl })
  } catch (error) {
    console.error('❌ Stripe API Error [create-portal-session]:', error)
    return res.status(error.statusCode || 400).json({
      error: error.type || 'StripeAPIError',
      message: error.message || 'Failed to create Stripe billing portal session'
    })
  }
}

/**
 * POST /api/stripe/webhook
 * Public webhook endpoint for processing Stripe asynchronous payment and subscription events
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripe = getStripeInstance()
  let event

  try {
    if (stripe && webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } else {
      // Parse raw JSON body if signature verification secret is not configured
      const payloadString = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body)
      event = JSON.parse(payloadString)
    }

    // Process Stripe event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('✅ [Stripe Webhook] checkout.session.completed received for customer:', session.customer)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('🔄 [Stripe Webhook] customer.subscription.updated received for subscription:', subscription.id)
        break
      }
      default:
        console.log(`ℹ️ [Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error.message)
    return res.status(400).send(`Webhook Error: ${error.message}`)
  }
}
