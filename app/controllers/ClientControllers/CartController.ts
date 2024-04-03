import UserCart from '#models/UserCart'
import type { HttpContext } from '@adonisjs/core/http'
import { CartObject } from '../../../utils/types.js'

export default class CartsController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id

    const data = await UserCart.query().where('user_id', userId!).first()

    return response.json(data?.cart ?? { products: [] })
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
