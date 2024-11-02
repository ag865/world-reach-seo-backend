import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Category from './Category.js'
import OrderDetail from './OrderDetail.js'

export default class Website extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare domain: string

  @column()
  declare paidGeneralPrice: number

  @column()
  declare sellingGeneralPrice: number

  @column()
  declare paidCasinoPrice: number

  @column()
  declare sellingCasinoPrice: number

  @column()
  declare paidSportsBettingPrice: number

  @column()
  declare sellingSportsBettingPrice: number

  @column()
  declare paidForexPrice: number

  @column()
  declare sellingForexPrice: number

  @column()
  declare homepageLinkPrice: number

  @column()
  declare homepageLinkNotes: string

  @column()
  declare mozDA: number

  @column()
  declare aHrefsDR: number

  @column()
  declare organicTraffic: number

  @column()
  declare spamScore: number

  @column()
  declare trustFlow: number

  @column()
  declare websiteEmail: string

  @column()
  declare currentEmail: string

  @column()
  declare loyalServices: string

  @column()
  declare banner: boolean

  @column()
  declare bannerPrice: number

  @column()
  declare bannerNotes: string

  @column()
  declare adminNotes: string

  @column()
  declare clientNotes: string

  @column()
  declare homePageLink: boolean

  @column()
  declare acceptsGambling: boolean

  @column()
  declare acceptsForex: boolean

  @column()
  declare sportsBetting: boolean

  @column()
  declare insertionLink: boolean

  @column()
  declare insertionLinkPrice: number

  @column()
  declare currency: string

  @column()
  declare language: string

  @column()
  declare country: string

  @column()
  declare hide: boolean

  @column()
  declare uploadDate?: Date

  @column()
  declare lastUpdated?: Date

  @manyToMany(() => Category, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'website_id',
    pivotRelatedForeignKey: 'category_id',
    pivotTable: 'website_category',
    pivotTimestamps: false,
  })
  declare categories: Relations.ManyToMany<typeof Category>

  @hasMany(() => OrderDetail)
  declare orderDetails: Relations.HasMany<typeof OrderDetail>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
