import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('semrush_as')
      table.decimal('referring_domain')
      table.decimal('linked_root_domains')
    })
  }
}
