import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_details'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('link').alter()
      table.text('custom_id').alter()
      table.text('restricted_niche').alter()
      table.text('draft_url').alter()
      table.text('anchor_url').alter()
      table.text('live_url').alter()
      table.text('target_url').alter()
      table.text('notes').alter()
      table.text('article_topic').alter()
      table.text('keywords').alter()
      table.text('guidelines').alter()
    })
  }
}
