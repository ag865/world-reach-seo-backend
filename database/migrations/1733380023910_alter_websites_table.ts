import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('semrush_trend')
      table.string('moz_spam_score_trend')
      table.string('moz_da_trend')
      table.string('ahrefs_trend')
    })
  }
}
