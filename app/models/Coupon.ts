import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OrderMaster from './OrderMaster.js'
import User from './User.js'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare couponCode: string

  @column()
  declare startDate: Date

  @column()
  declare endDate: Date

  @column()
  declare type: string

  @column()
  declare value: number

  @column()
  declare oneTimeUse: boolean

  @manyToMany(() => User, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'coupon_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'coupon_users',
    pivotTimestamps: false,
  })
  declare users: Relations.ManyToMany<typeof User>

  @hasMany(() => OrderMaster, { foreignKey: 'couponId' })
  declare orders: Relations.HasMany<typeof OrderMaster>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
