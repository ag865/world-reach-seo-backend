import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Coupon from './Coupon.js'
import OrderDetail from './OrderDetail.js'
import User from './User.js'

export default class OrderMaster extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare couponId: number

  @column()
  declare orderNumber: string

  @column()
  declare poNumber: string

  @column()
  declare status: string

  @column()
  declare paymentMethod: string

  @column()
  declare paymentStatus: string

  @column()
  declare discountType: string

  @column()
  declare discountValue: number

  @column()
  declare totalAmount: number

  @column()
  declare discountAmount: number

  @column()
  declare netAmount: number

  @column()
  declare billingAddressFirstName: string

  @column()
  declare billingAddressLastName: string

  @column()
  declare billingAddressBusinessName: string

  @column()
  declare billingAddressEmail: string

  @column()
  declare billingAddressAddress: string

  @column()
  declare billingAddressCity: string

  @column()
  declare billingAddressPostalCode: string

  @column()
  declare billingAddressCountry: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: Relations.BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  declare coupon: Relations.BelongsTo<typeof Coupon>

  @hasMany(() => OrderDetail, { foreignKey: 'orderId' })
  declare details: Relations.HasMany<typeof OrderDetail>

  serializeExtras = true
}
