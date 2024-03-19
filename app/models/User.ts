import { withAuthFinder } from '@adonisjs/auth'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import BillingAddress from './BillingAddress.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column()
  declare avatar: string

  @column({ serializeAs: null })
  declare resetPasswordKey: string

  @column()
  declare referralKey: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isAdmin: boolean

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => BillingAddress)
  declare billingAddress: HasOne<typeof BillingAddress>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
