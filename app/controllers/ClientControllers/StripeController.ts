import UserCart from '#models/UserCart'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import Stripe from 'stripe'

const stripe = new Stripe(env.get('STRIPE_SECRET'))

export default class StripesController {
  async index({ response, request }: HttpContext) {
    const { session_id } = request.qs()

    const session = await stripe.checkout.sessions.retrieve(session_id)

    return response.json({
      status: session.status,
    })
  }

  async store({ response, auth }: HttpContext) {
    const userId = auth.user?.id!

    const cart = await UserCart.query().where('userId', userId).first()

    const products = cart?.cart.products ?? []

    const lineItems: any[] = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const stripePrice = await stripe.prices.create({
        product_data: {
          name: product.website.domain,
        },
        active: true,
        currency: 'usd',
        unit_amount: (product.totalPrice ?? 0) * 100,
      })
      lineItems.push({ price: stripePrice.id, quantity: 1 })
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${env.get('CLIENT_URL')}/cart/checkout?session_id={CHECKOUT_SESSION_ID}`,
    })
    return response.json({ clientSecret: session.client_secret })
  }
}
