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
