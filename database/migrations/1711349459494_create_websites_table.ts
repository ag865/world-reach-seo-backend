import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('domain').unique().notNullable()

      table.double('paid_general_price')
      table.double('selling_general_price')
      table.double('paid_casino_price')
      table.double('selling_casino_price')
      table.double('selling_erotic_price')
      table.double('paid_erotic_price')
      table.double('selling_crypto_price')
      table.double('paid_crypto_price')
      table.double('old_price')
      table.double('homepage_link_price')

      table.integer('moz_da')
      table.integer('a_hrefs_dr')
      table.integer('organic_traffic')
      table.integer('spam_score')
      table.integer('trust_flow')
      table.integer('semursh')
      table.integer('referring_domain')

      table.string('website_email')
      table.string('old_email')
      table.string('current_email')
      table.string('loyal_services')
      table.string('banner')
      table.text('notes')

      table.boolean('home_page_link')
      table.boolean('accepts_gambling')
      table.boolean('accepts_forex')
      table.boolean('sports_betting')

      table.string('currency')
      table.string('language')
      table.string('country')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
