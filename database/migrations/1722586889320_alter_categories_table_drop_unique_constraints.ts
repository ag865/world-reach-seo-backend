import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['name'])
      table.dropUnique(['slug'])
    })
  }
  async down() {}
}
