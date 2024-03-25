import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Website from './Website.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @manyToMany(() => Website, {
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'category_id',
    pivotRelatedForeignKey: 'website_id',
    pivotTable: 'website_category',
    pivotTimestamps: false,
  })
  declare websites: Relations.ManyToMany<typeof Website>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
