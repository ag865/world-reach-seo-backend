import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class PaymentApiSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare paypalId: string

  @column()
  declare paypalSecret: string

  @column()
  declare stripeKey: string

  @column()
  declare stripeSecret: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
