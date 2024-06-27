import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule, uniqueWhenUpdateRule } from './rules/unique.js'

export const createCouponValidator = vine.compile(
  vine.object({
    couponCode: vine
      .string()
      .trim() 
      .use(uniqueRule({ table: 'coupons', column: 'coupon_code', iLike: true })),

    name: vine.string(),
    startDate: vine.date(),
    endDate: vine.date(),
    type: vine.string(),
    value: vine.number(),
    oneTimeUse: vine.boolean().optional(),
    users: vine.array(vine.number()).optional(),
  })
)

createCouponValidator.messagesProvider = new SimpleMessagesProvider({
  'couponCode.required': 'Coupon code is required',
  'couponCode.unique': 'Coupon code already exists',
  'name.required': 'Name is required',
  'startDate.required': 'Start date is required',
  'endDate.required': 'End date is required',
  'type.required': 'Coupon discount type is required',
  'value.required': 'Coupon discount is required',
})

export const updateCouponValidator = (id: number) =>
  vine.compile(
    vine.object({
      couponCode: vine
        .string()
        .trim() 
        .use(uniqueWhenUpdateRule({ table: 'coupons', column: 'coupon_code', id, iLike: true })),

      name: vine.string(),
      startDate: vine.date(),
      endDate: vine.date(),
      type: vine.string(),
      value: vine.number(),
      oneTimeUse: vine.boolean().optional(),
      users: vine.array(vine.number()).optional(),
    })
  )

updateCouponValidator.messagesProvider = new SimpleMessagesProvider({
  'couponCode.required': 'Coupon code is required',
  'couponCode.unique': 'Coupon code already exists',
  'name.required': 'Name is required',
  'startDate.required': 'Start date is required',
  'endDate.required': 'End date is required',
  'type.required': 'Coupon discount type is required',
  'value.required': 'Coupon discount is required',
})
