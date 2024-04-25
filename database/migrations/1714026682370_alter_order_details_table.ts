import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('link').defaultTo('URL')
      table.double('link_price')
    })
  }
}
