import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule, uniqueWhenUpdateRule } from './rules/unique.js'

export const categoryCreateValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .use(uniqueRule({ table: 'categories', column: 'name', iLike: true })),
  })
)

categoryCreateValidator.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'Category name is required',
  'name.unique': 'Category name already exists',
})

export const categoryUpdateValidator = (id: number) =>
  vine.compile(
    vine.object({
      name: vine
        .string()
        .trim()
        .use(uniqueWhenUpdateRule({ table: 'categories', column: 'name', id, iLike: true })),
    })
  )

categoryUpdateValidator.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'Category name is required',
  'name.unique': 'Category name already exists',
})
