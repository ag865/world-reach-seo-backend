import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueWhenUpdateRule } from './rules/unique.js'
export const updateMemberValidator = (id: number) =>
  vine.compile(
    vine.object({
      firstName: vine.string().trim(),
      lastName: vine.string().trim(),
      email: vine
        .string()
        .trim()
        .email()
        .use(uniqueWhenUpdateRule({ table: 'users', column: 'email', id })),
      avatar: vine
        .file({
          extnames: ['jpg', 'png', 'jpeg', 'webp'],
        })
        .optional(),
    })
  )

updateMemberValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
  'avatar.file.extname': 'Please upload an image file',
})

export const updateUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    avatar: vine
      .file({
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
      .optional(),
  })
)

updateUserValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'avatar.file.extname': 'Please upload an image file',
})
