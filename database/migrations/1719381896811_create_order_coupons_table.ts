import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_masters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('coupon_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('coupons')
        .onDelete('CASCADE')
        .nullable()

      table.string('discount_type').nullable()
      table.double('discount_value').nullable()
      table.double('discount_amount').nullable()
      table.double('net_amount').nullable()
    })
  }
}
