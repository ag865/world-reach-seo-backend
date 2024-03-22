import SalesRepresentative from '#models/SalesRepresentative'
import { SalesRepresentativeValidator } from '#validators/SalesRepresentativeValidator'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class SalesRepresentativesController {
  /**
   * Get a list of resource
   */
  async index({ response }: HttpContext) {
    const data = await SalesRepresentative.first()
    return response.json(data ?? { firstName: '', lastName: '', email: '' })
  }

  /**
   * Handle for the create resource
   */
  async store({ response, request }: HttpContext) {
    const { avatar, ...requestData } = await request.validateUsing(SalesRepresentativeValidator)

    const salesRep = await SalesRepresentative.first()

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    if (salesRep) {
      await SalesRepresentative.query().where('id', salesRep.id).update(data)
    } else {
      await SalesRepresentative.create(data)
    }

    return response.json({
      msg: 'Sales representative updated successfully',
    })
  }
}
