import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ProjectFavourite from './ProjectFavourite.js'
import User from './User.js'
import Website from './Website.js'

export default class Favourite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare websiteId: number

  @belongsTo(() => User)
  declare user: Relations.BelongsTo<typeof User>

  @belongsTo(() => Website)
  declare website: Relations.BelongsTo<typeof Website>

  @hasMany(() => ProjectFavourite, { foreignKey: 'favouriteId' })
  declare favourites: Relations.HasMany<typeof ProjectFavourite>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
