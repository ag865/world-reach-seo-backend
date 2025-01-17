import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('upload_date').defaultTo(null)
      table.date('last_updated').defaultTo(null)
    })
  }

  async down() {}
}
