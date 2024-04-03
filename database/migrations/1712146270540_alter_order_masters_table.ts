import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_masters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('billing_address_first_name')
      table.string('billing_address_last_name')
      table.string('billing_address_business_name')
      table.string('billing_address_email')
      table.string('billing_address_address')
      table.string('billing_address_city')
      table.string('billing_address_postal_code')
      table.string('billing_address_country')
    })
  }
}
