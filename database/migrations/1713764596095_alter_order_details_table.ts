import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('details_added').defaultTo(false)
    })
  }
}
