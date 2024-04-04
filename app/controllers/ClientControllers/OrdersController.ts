import OrderDetail from '#models/OrderDetail'
import OrderMaster from '#models/OrderMaster'
import { OrderServices } from '#services/index'
import { createOrderValidator } from '#validators/OrderValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  async index({ request, response, auth }: HttpContext) {
    const params = request.qs()

    let { status = '', search = '', limit = 10, page = 1, order = 'desc', sort = 'id' } = params

    if (search) search = `${search}%`

    const userId = auth.user?.id

    const data = await OrderServices.get(limit, page, order, sort, search, status, userId)

    return response.json(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id

    const { details, ...data } = await request.validateUsing(createOrderValidator)

    const orderNumber = await OrderServices.getOrderNumber()

    const order = await OrderMaster.create({ ...data, userId, status: 'Pending', orderNumber })

    await order.related('details').createMany(details)

    return response.json({ msg: 'Order placed successfully', order })
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    const data = await OrderServices.getByValue('orderNumber', id)

    return response.json(data)
  }

  async update({ params, request, response }: HttpContext) {
    const data: any = request.body()

    const { id } = params

    await OrderDetail.query()
      .where('id', id)
      .update({ ...data })

    return response.json({ msg: 'Order updated successfully' })
  }
}
