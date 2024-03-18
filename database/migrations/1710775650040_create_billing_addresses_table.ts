import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'billing_addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('business_name').nullable()
      table.string('address').nullable()
      table.string('postal_code').nullable()
      table.string('city').nullable()
      table.string('country').nullable()
      table.string('email').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
