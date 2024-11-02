import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('country').nullable()
      table.string('company').nullable()
      table.string('phone_number').nullable()
      table.string('vat_id').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('postal_code').nullable()
    })
  }
}
