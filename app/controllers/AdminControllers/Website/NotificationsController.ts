import Notification from '#models/Notification'
import { HttpContext } from '@adonisjs/core/http'

export default class NotificationsController {
  async index({ request, response }: HttpContext) {
    const { page } = request.qs()

    const data = await Notification.query()
      .whereNull('user_id')
      .orderBy('created_at', 'desc')
      .paginate(page, 5)

    return response.status(200).json(data)
  }

  async update({ response, params }: HttpContext) {
    const { id } = params

    await Notification.query().where('id', id).update({ read: true })

    return response.status(200)
  }

  async getUnreadNotifications({ response }: HttpContext) {
    const unreadNotifications = await Notification.query()
      .whereNull('user_id')
      .andWhere('read', false)
      .count('* as total')
      .first()

    return response
      .status(200)
      .json({ unreadNotifications: unreadNotifications?.$extras.total !== '0' })
  }
}
