import { withAuthFinder } from '@adonisjs/auth'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import BillingAddress from './BillingAddress.js'
import Favourite from './Favourite.js'
import OrderMaster from './OrderMaster.js'
import Project from './Project.js'
import UserCart from './UserCart.js'
import UserCountry from './UserCountry.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName?: string | null

  @column()
  declare lastName?: string | null

  @column()
  declare email: string

  @column()
  declare avatar?: string

  @column()
  declare country?: string

  @column()
  declare company?: string

  @column()
  declare phoneNumber?: string

  @column()
  declare vatId?: string

  @column()
  declare address?: string

  @column()
  declare city?: string

  @column()
  declare postalCode?: string

  @column()
  declare industry?: string

  @column()
  declare resetPasswordKey?: string

  @column()
  declare referralKey?: string

  @column({ serializeAs: null })
  declare password?: string

  @column()
  declare isAdmin?: boolean

  @column()
  declare isActive?: boolean

  @column()
  declare isVerified?: boolean

  @column()
  declare referralId?: number

  @column()
  declare stepNumber?: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => BillingAddress)
  declare billingAddress: HasOne<typeof BillingAddress>

  @hasMany(() => UserCountry)
  declare countries: HasMany<typeof UserCountry>

  @hasOne(() => UserCart)
  declare cart: HasOne<typeof UserCart>

  @hasMany(() => OrderMaster)
  declare orders: HasMany<typeof OrderMaster>

  @hasMany(() => User, { foreignKey: 'referral_id' })
  declare clients: HasMany<typeof User>

  @belongsTo(() => User, { foreignKey: 'referral_id' })
  declare referredBy: BelongsTo<typeof User>

  @hasMany(() => Favourite, { foreignKey: 'user_id' })
  declare favourites: HasMany<typeof Favourite>

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
