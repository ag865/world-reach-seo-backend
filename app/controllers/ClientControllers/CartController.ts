import UserCart from '#models/UserCart'
import Website from '#models/Website'
import type { HttpContext } from '@adonisjs/core/http'
import { Cart, CartObject } from '../../../utils/types.js'

export default class CartsController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id

    const data = await UserCart.query().where('user_id', userId!).first()

    let products: any[] = []

    if (data?.cart.products.length) {
      const ids = data?.cart.products.map((product) => product.website.id)

      const websites = await Website.query().whereIn('id', ids)

      data.cart.products.map((product: Cart) => {
        const website = websites.find((website) => website.id === product.website.id)

        products.push({ ...product, website })
      })
    }

    return response.json({ products })
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id

    const cart = request.body() as CartObject

    const userCart = await UserCart.query().where('user_id', userId!).first()

    if (userCart) await UserCart.query().where('id', userCart.id).update({ cart })
    else await UserCart.create({ cart, userId })

    return response.json({ message: 'Cart updated successfully' })
  }
}
