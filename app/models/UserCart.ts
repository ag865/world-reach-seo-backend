import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { CartObject } from '../../utils/types.js'
import User from './User.js'

export default class UserCart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare cart: CartObject

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: Relations.BelongsTo<typeof User>
}
