import BillingAddress from '#models/BillingAddress'
import { billingAddressValidator } from '#validators/BillingAddressValidator'
import { type HttpContext } from '@adonisjs/core/http'

export default class BillingAddressesController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id

    const data = await BillingAddress.query().where('user_id', userId!).first()
    return response.json(
      data ?? {
        firstName: '',
        lastName: '',
        businessName: '',
        email: '',
        address: '',
        postalCode: '',
        city: '',
        country: '',
      }
    )
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    const data = await request.validateUsing(billingAddressValidator)

    const billingAddress = await BillingAddress.query().where('user_id', userId!).first()
    console.log(data)
    if (billingAddress) {
      await BillingAddress.query().where('id', billingAddress.id).update(data)
    } else {
      await BillingAddress.create({ ...data, userId })
    }

    return response.json({
      msg: 'Billing address updated successfully',
    })
  }
}
