import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'website_organic_traffics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('website_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('websites')
        .onDelete('CASCADE')

      table.date('date')
      table.bigint('organic_traffic')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
