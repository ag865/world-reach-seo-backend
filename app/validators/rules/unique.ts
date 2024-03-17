import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}

async function unique(value: any, options: Options, field: FieldContext) {
  const row = await db.from(options.table).where(options.column, value).first()
  if (row) field.report('The {{ field }} is already in use', 'unique', field)
}

export const uniqueRule = vine.createRule(unique)

type UniqueOptions = {
  table: string
  column: string
  id: number
}

async function uniqueWhenUpdate(value: any, options: UniqueOptions, field: FieldContext) {
  const row = await db
    .from(options.table)
    .where(options.column, value)
    .andWhereNot('id', options.id)
    .first()
  if (row) field.report('The {{ field }} is already in use', 'unique', field)
}
export const uniqueWhenUpdateRule = vine.createRule(uniqueWhenUpdate)
