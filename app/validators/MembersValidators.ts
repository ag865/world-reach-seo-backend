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

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().trim(),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/),
    confirmPassword: vine.string().trim().sameAs('password'),
  })
)
updatePasswordValidator.messagesProvider = new SimpleMessagesProvider({
  'currentPassword.required': 'Current password is required',
  'password.required': 'Password is required',
  'password.minLength': 'Password must be 8 characters long',
  'password.regex':
    'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
  'confirmPassword.sameAs': 'Confirm password must be same as the password',
})
