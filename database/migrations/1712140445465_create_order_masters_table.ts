import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_masters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('order_number')
      table.string('po_number').nullable()

      table.string('status')
      table.string('payment_method')
      table.string('payment_status')

      table.double('total_amount')

      table.string('billing_address_first_name')
      table.string('billing_address_last_name')
      table.string('billing_address_business_name')
      table.string('billing_address_email')
      table.string('billing_address_address')
      table.string('billing_address_city')
      table.string('billing_address_postal_code')
      table.string('billing_address_country')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
