import PaymentApiSetting from '#models/PaymentAPISetting'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const PaymentAPISettingValidator = vine.compile(
  vine.object({
    paypalId: vine.string().optional(),
    paypalSecret: vine.string().optional(),
    stripeKey: vine.string().trim().optional(),
    stripeSecret: vine.string().optional(),
  })
)

export default class PaymentApiSettingsController {
  /**
   * Get a list of resource
   */
  async index({ response }: HttpContext) {
    const data = await PaymentApiSetting.first()
    return response.json(data)
  }

  /**
   * Handle for the create resource
   */
  async store({ response, request }: HttpContext) {
    const data = await request.validateUsing(PaymentAPISettingValidator)

    const settings = await PaymentApiSetting.first()

    if (settings) {
      await PaymentApiSetting.query().where('id', settings.id).update(data)
    } else {
      await PaymentApiSetting.create(data)
    }

    return response.json({
      msg: 'Payment API Settings updated successfully',
    })
  }
}
