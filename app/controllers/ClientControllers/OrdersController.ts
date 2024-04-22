import OrderDetail from '#models/OrderDetail'
import OrderMaster from '#models/OrderMaster'
import User from '#models/User'
import Ws from '#services/Ws'
import { NotificationServices, OrderServices } from '#services/index'
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

    const order = await OrderMaster.create({
      ...data,
      userId,
      status: 'Pending',
      orderNumber,
      paymentStatus: 'Paid',
    })

    await order.related('details').createMany(details)

    const user = await User.query().where('id', order.userId).first()

    const notification = await NotificationServices.create(
      order.orderNumber,
      'Admin',
      `New Order - ${order.orderNumber}`,
      `A new order has been placed from Mr/Ms '${user!.firstName} ${user!.lastName}'.`
    )

    Ws.io?.emit('message', notification)

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

    const detail = await OrderDetail.query()
      .preload('order', (query) => {
        query.preload('user')
      })
      .preload('website')
      .where('id', id)
      .first()

    await OrderDetail.query()
      .where('id', id)
      .update({ ...data, detailsAdded: true })

    const notification = await NotificationServices.create(
      detail!.order.orderNumber,
      'Admin',
      `Order Details ${detail?.detailsAdded ? 'Updated' : 'Added'} - ${detail!.order.orderNumber}`,
      `Mr/Ms '${detail!.order.user.firstName} ${detail!.order.user.lastName}' have ${detail?.detailsAdded ? 'updated' : 'added'} details for ${detail?.website.domain}.`
    )
    Ws.io?.emit('message', notification)

    return response.json({ msg: 'Order updated successfully' })
  }
}
