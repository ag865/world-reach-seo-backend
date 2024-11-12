import SalesRepresentative from '#models/SalesRepresentative'
import User from '#models/User'
import { HttpContext } from '@adonisjs/core/http'

export default class SalesRepresentativesController {
  async handle({ response, auth }: HttpContext) {
    const userId = auth!.user!.id

    const user = await User.query().where('id', userId).first()

    if (user && user.referralId) {
      const salesRepresentative = await User.query().where('id', user.referralId).first()

      if (salesRepresentative)
        return response.json({
          firstName: salesRepresentative.firstName,
          lastName: salesRepresentative.lastName,
          email: salesRepresentative.email,
          avatar: salesRepresentative.avatar,
        })
    }

    const data = await SalesRepresentative.first()

    return response.json(data ?? { firstName: '', lastName: '', email: '' })
  }
}
