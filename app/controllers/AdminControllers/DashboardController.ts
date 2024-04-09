import OrderMaster from '#models/OrderMaster'
import User from '#models/User'
import Website from '#models/Website'
import { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async handle({ response }: HttpContext) {
    const orders = await OrderMaster.query().count('* as total').first()

    const clients = await User.query().where('isAdmin', false).count('* as total').first()

    const activeClients = await User.query()
      .where('isAdmin', false)
      .andWhere('isActive', true)
      .count('* as total')
      .first()

    const links = await Website.query().count('* as total').first()

    return response.status(200).json({
      orders: orders?.$extras.total,
      clients: clients?.$extras.total,
      activeClients: activeClients?.$extras.total,
      links: links?.$extras.total,
    })
  }
}
