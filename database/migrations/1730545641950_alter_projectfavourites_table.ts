import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projectfavourites'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('favourite_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('favourites')
        .onDelete('CASCADE')
    })
  }
}
