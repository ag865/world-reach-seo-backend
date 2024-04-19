import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('selling_erotic_price')
      table.dropColumn('paid_erotic_price')
      table.dropColumn('selling_crypto_price')
      table.dropColumn('paid_crypto_price')
      table.dropColumn('old_price')
      table.dropColumn('notes')
      table.dropColumn('domain_age')
      table.dropColumn('semursh')
      table.dropColumn('referring_domain')
      table.dropColumn('bazoom_price')
      table.dropColumn('bazoom_price_gambling')
      table.dropColumn('bazoom_price_erotic')
      table.dropColumn('bazoom_price_crypto')
      table.dropColumn('old_email')

      table.double('paid_forex_price')
      table.double('selling_forex_price')

      table.double('paid_sports_betting_price')
      table.double('selling_sports_betting_price')

      table.text('admin_notes')
      table.text('client_notes')
    })
  }
}
