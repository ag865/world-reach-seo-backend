import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('domain_age')
      table.integer('bazoom_price')
      table.integer('bazoom_price_gambling')
      table.integer('bazoom_price_erotic')
      table.integer('bazoom_price_crypto')
    })
  }
}
