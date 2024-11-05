import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Favourite from './Favourite.js'
import Project from './Project.js'

export default class ProjectFavourite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @column()
  declare favouriteId: number

  @belongsTo(() => Project)
  declare project: Relations.BelongsTo<typeof Project>

  @belongsTo(() => Favourite)
  declare favourite: Relations.BelongsTo<typeof Favourite>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
