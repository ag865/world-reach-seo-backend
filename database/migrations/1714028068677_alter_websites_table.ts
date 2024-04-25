import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('moz_da')
      table.dropColumn('a_hrefs_dr')
      table.dropColumn('organic_traffic')
      table.dropColumn('spam_score')
      table.dropColumn('trust_flow')
    })
  }
}
