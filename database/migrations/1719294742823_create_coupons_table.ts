import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'coupons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('coupon_code').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.string('type').notNullable()
      table.bigint('value').notNullable()
      table.boolean('one_time_use').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
