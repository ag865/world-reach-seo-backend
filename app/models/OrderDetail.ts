import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OrderMaster from './OrderMaster.js'
import Website from './Website.js'

export default class OrderDetail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare websiteId: number

  @column()
  declare customId: string

  @column()
  declare restrictedNiche: string

  @column()
  declare words: number

  @column()
  declare contentByMarketplace: boolean

  @column()
  declare totalPrice: number

  @column()
  declare contentPrice: number

  @column()
  declare mediaPrice: number

  @column()
  declare status: string

  @column()
  declare publicationDate: DateTime

  @column()
  declare liveDate: DateTime

  @column()
  declare draftUrl: string

  @column()
  declare anchorUrl: string

  @column()
  declare liveUrl: string

  @column()
  declare targetUrl: string

  @column()
  declare notes: string

  @column()
  declare articleTopic: string

  @column()
  declare keywords: string

  @column()
  declare guidelines: string

  @column()
  declare picture: boolean

  @column()
  declare detailsAdded: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Website)
  declare website: Relations.BelongsTo<typeof Website>

  @belongsTo(() => OrderMaster, { foreignKey: 'orderId' })
  declare order: Relations.BelongsTo<typeof OrderMaster>
}
