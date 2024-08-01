import NotFoundException from '#exceptions/NotFoundException'
import { CouponServices } from '#services/index'
import { createCouponValidator, updateCouponValidator } from '#validators/CouponValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class CouponsController {
  async index({ request, response }: HttpContext) {
    const params = request.qs()

    const data = await CouponServices.getCoupons(params)

    return response.json(data)
  }

  async store({ request, response }: HttpContext) {
    const { users, ...data } = await request.validateUsing(createCouponValidator)

    await CouponServices.createCoupon(data, users ?? [])

    // const clients = await getClients(users ?? [])

    // for (let i = 0; i < clients.length; i++)
    //   await mail.sendLater((message) => {
    //     message
    //       .to(clients[i].email)
    //       .from(env.get('SMTP_USERNAME'))
    //       .subject('Verify your email address')
    //       .htmlView('emails/coupon_email_html', {
    //         name: `${clients[i].firstName} ${clients[i].lastName}`,
    //         couponCode: data.couponCode,
    //         discount: data.type === 'Percentage' ? `${data.value}%` : `$${data.value}`,
    //         discountText:
    //           data.startDate !== data.endDate
    //             ? `from ${moment(data.startDate).format('MMM DD')} to ${moment(data.endDate).format('MMM DD')} `
    //             : `on ${moment(data.startDate).format('MMM DD, YYYY')}`,
    //       })
    //   })

    return response.json({ msg: 'Coupon created successfully' })
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    const coupon = await CouponServices.getCouponByValue('id', id)

    if (!coupon) throw new NotFoundException('coupon')

    const { users, ...data } = await request.validateUsing(updateCouponValidator(id))

    await CouponServices.updateCoupon(data, users ?? [], id, coupon)

    return response.json({ msg: 'Coupon updated successfully' })
  }

  async destroy({ params, response }: HttpContext) {
    const id = params.id as number

    const coupon = await CouponServices.getCouponByValue('id', id)

    if (!coupon) throw new NotFoundException('id', 'Coupon doest not exist')

    await CouponServices.destroy(id)

    return response.json({ msg: 'Coupon deleted successfully' })
  }
}
