import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('order_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('order_masters')
        .onDelete('CASCADE')
      table
        .integer('website_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('websites')
        .onDelete('CASCADE')

      table.string('custom_id').nullable()
      table.string('restricted_niche')
      table.integer('words').nullable()
      table.boolean('content_by_marektplace')

      table.double('total_price')
      table.double('content_price')
      table.double('media_price')
      table.double('status')

      table.date('publication_date').nullable()
      table.date('live_date').nullable()

      table.string('draft_url').nullable()
      table.string('anchor_url').nullable()
      table.string('live_url').nullable()
      table.string('target_url').nullable()

      table.string('notes').nullable()
      table.string('article_topic').nullable()
      table.string('keywords').nullable()
      table.string('guidelines').nullable()

      table.boolean('picture').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
