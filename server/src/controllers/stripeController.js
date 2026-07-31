import Stripe from 'stripe'

/**
 * POST /api/stripe/create-checkout-session
 * Initializes a Stripe checkout session for CoverFlow plan upgrades
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { plan = 'Pro Enterprise', cycle = 'monthly' } = req.body
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

    const stripeSecret = process.env.STRIPE_SECRET_KEY

    // If Stripe Secret Key is present and valid, initialize real Stripe Checkout Session
    if (stripeSecret && stripeSecret.startsWith('sk_')) {
      const stripe = new Stripe(stripeSecret)

      const isAnnual = cycle === 'annual'
      let unitAmount = 1900 // $19.00 default for Pro Monthly

      if (plan === 'Carrier Enterprise') {
        unitAmount = isAnnual ? 7900 : 9900 // $79 or $99
      } else {
        unitAmount = isAnnual ? 1500 : 1900 // $15 or $19
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
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
        ],
        mode: 'subscription',
        success_url: `${clientUrl}/settings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/pricing?payment=cancelled`
      })

      return res.status(200).json({ url: session.url })
    }

    // Fallback Mock URL for development/demo testing when real Stripe credentials are not present
    const mockSessionUrl = `${clientUrl}/settings?payment=success&plan=${encodeURIComponent(plan)}&cycle=${cycle}`
    return res.status(200).json({ url: mockSessionUrl })
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/stripe/create-portal-session
 * Initializes a Stripe Billing Portal session for managing subscriptions and payment methods
 */
export const createPortalSession = async (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const customerId = req.body?.customerId || 'cus_dummy123'

    if (stripeSecret && stripeSecret.startsWith('sk_')) {
      const stripe = new Stripe(stripeSecret)

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${clientUrl}/settings`
      })

      return res.status(200).json({ url: portalSession.url })
    }

    // Fallback Mock Portal URL for development/demo testing
    const mockPortalUrl = `${clientUrl}/settings?portal=active&customer=${customerId}`
    return res.status(200).json({ url: mockPortalUrl })
  } catch (error) {
    console.error('Error creating Stripe portal session:', error)
    return res.status(500).json({ error: 'Internal Server Error', message: error.message })
  }
}

/**
 * POST /api/stripe/webhook
 * Public webhook endpoint for processing Stripe asynchronous payment and subscription events
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event

  try {
    if (webhookSecret && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
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
