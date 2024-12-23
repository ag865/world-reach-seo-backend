import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Website from './Website.js'

export default class WebsiteOrganicTraffic extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare websiteId: number

  @column()
  declare organicTraffic: number

  @column()
  declare date: Date

  @belongsTo(() => Website)
  declare website: Relations.BelongsTo<typeof Website>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
