import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import * as Relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import ProjectFavourite from './ProjectFavourite.js'
import User from './User.js'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: Relations.BelongsTo<typeof User>

  @hasMany(() => ProjectFavourite, { foreignKey: 'project_id' })
  declare favourites: Relations.HasMany<typeof ProjectFavourite>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
