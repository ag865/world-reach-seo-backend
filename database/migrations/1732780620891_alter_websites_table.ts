import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('screenshot_url')
      table.date('screenshot_date')
    })
  }
}
