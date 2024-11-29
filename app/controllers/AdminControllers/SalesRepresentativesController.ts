import SalesRepresentative from '#models/SalesRepresentative'
import { S3Service } from '#services/index'
import { SalesRepresentativeValidator } from '#validators/SalesRepresentativeValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class SalesRepresentativesController {
  async index({ response }: HttpContext) {
    const data = await SalesRepresentative.first()
    return response.json(data ?? { firstName: '', lastName: '', email: '' })
  }

  async store({ response, request }: HttpContext) {
    const { avatar, ...requestData } = await request.validateUsing(SalesRepresentativeValidator)

    const salesRep = await SalesRepresentative.first()

    let data: any = requestData

    if (avatar) {
      const publicUrl = await S3Service.uploadAvatar(avatar)
      data = { ...data, avatar: publicUrl }
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
