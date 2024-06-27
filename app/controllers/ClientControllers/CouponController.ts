import OrderMaster from '#models/OrderMaster'
import { CouponServices } from '#services/index'
import { HttpContext } from '@adonisjs/core/http'

export default class CouponController {
  async handle({ response, auth, params }: HttpContext) {
    const userId = auth!.user!.id

    const { code } = params

    const coupon = await CouponServices.getCouponByValue('coupon_code', code, true)

    if (!coupon) return response.status(404).json([{ message: 'Invalid coupon code!' }])

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const startDate = new Date(coupon.startDate)
    const endDate = new Date(coupon.endDate)

    if (!(currentDate >= startDate && currentDate <= endDate))
      return response.status(400).json([{ message: 'This coupon is not valid at this time!' }])

    if (coupon.users?.length) {
      const user = coupon.users.find((a) => a.id === userId)

      if (!user)
        return response.status(400).json([{ message: 'You are not eligible to use this coupon!' }])
    }

    if (coupon.oneTimeUse) {
      const order = await OrderMaster.query()
        .where('user_id', userId)
        .andWhere('coupon_id', coupon.id)
        .first()

      if (order) {
        return response.status(400).json([{ message: 'You have already used this coupon!' }])
      }
    }

    return response.json(coupon)
  }
}
