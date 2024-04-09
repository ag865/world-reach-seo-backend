import OrderDetail from '#models/OrderDetail'
import OrderMaster from '#models/OrderMaster'
import { OrderServices } from '#services/index'
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

    const detail = await OrderDetail.query().where('id', id).first()

    let dataToUpdate: any = { ...data }

    if (!detail?.liveUrl && data.liveUrl) {
      dataToUpdate = { ...dataToUpdate, liveDate: new Date() }
    }

    await OrderDetail.query().where('id', id).update(dataToUpdate)

    return response.json({ msg: 'Order updated successfully' })
  }

  async store({ request, response }: HttpContext) {
    const { status, id }: any = request.body()

    await OrderMaster.query().where('id', id).update({ status })

    return response.json({ msg: 'Order updated successfully' })
  }
}
