import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.double('moz_da')
      table.double('a_hrefs_dr')
      table.double('organic_traffic')
      table.double('spam_score')
      table.double('trust_flow')
    })
  }
}
