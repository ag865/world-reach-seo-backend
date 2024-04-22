import OrderDetail from '#models/OrderDetail'
import OrderMaster from '#models/OrderMaster'
import Ws from '#services/Ws'
import { NotificationServices, OrderServices } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  async index({ request, response }: HttpContext) {
    const params = request.qs()

    let {
      status = '',
      search = '',
      limit = 10,
      page = 1,
      order = 'desc',
      sort = 'id',
      userId = '',
    } = params

    if (search) search = `${search}%`

    const data = await OrderServices.get(limit, page, order, sort, search, status, userId)

    return response.json(data)
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
      .preload('order')
      .preload('website')
      .where('id', id)
      .first()

    let dataToUpdate: any = { ...data }

    if (!detail?.liveUrl && data.liveUrl) {
      dataToUpdate = { ...dataToUpdate, liveDate: new Date() }
    }

    await OrderDetail.query().where('id', id).update(dataToUpdate)

    const notification = await NotificationServices.create(
      detail!.order.orderNumber,
      'Client',
      `Media Status Updated - ${detail!.order.poNumber ?? detail!.order.orderNumber}`,
      `Order media status changed from '${detail!.status}' to '${data.status}' for media '${detail!.website.domain}' .`,
      detail!.order?.userId
    )

    Ws.io?.emit('message', notification)

    return response.json({ msg: 'Order updated successfully' })
  }

  async store({ request, response }: HttpContext) {
    const { status, id }: any = request.body()

    const order = await OrderMaster.query().preload('user').where('id', id).first()

    await OrderMaster.query().where('id', id).update({ status })

    const notification = await NotificationServices.create(
      order!.orderNumber,
      'Client',
      `Order Status Updated - '${order!.poNumber ?? order!.orderNumber}'`,
      `Order status changed from '${order?.status}' to '${status}'.`,
      order?.userId
    )

    Ws.io?.emit('message', notification)

    return response.json({ msg: 'Order updated successfully' })
  }
}
