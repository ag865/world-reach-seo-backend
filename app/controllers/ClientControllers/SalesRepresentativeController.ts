import SalesRepresentative from '#models/SalesRepresentative'
import { HttpContext } from '@adonisjs/core/http'

export default class SalesRepresentativesController {
  async handle({ response }: HttpContext) {
    const data = await SalesRepresentative.first()
    return response.json(data ?? { firstName: '', lastName: '', email: '' })
  }
}
