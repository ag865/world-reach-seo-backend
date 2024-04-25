import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('domain').alter()
      table.text('website_email').alter()
      table.text('current_email').alter()
      table.text('admin_notes').alter()
      table.text('client_notes').alter()
      table.text('banner_notes').alter()
    })
  }
}
