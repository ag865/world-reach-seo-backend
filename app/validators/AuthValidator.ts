import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { existsRule } from './rules/exists.js'
import { uniqueRule, uniqueWhenUpdateRule } from './rules/unique.js'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)
loginValidator.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'password.required': 'Password is required',
  'email.email': 'Invalid email address',
})

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .use(existsRule({ table: 'users', column: 'email', iLike: true })),
  })
)
resetPasswordValidator.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
})

export const updatePasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    confirmPassword: vine.string().trim().sameAs('password'),
  })
)
updatePasswordValidator.messagesProvider = new SimpleMessagesProvider({
  'password.required': 'Password is required',
  'password.minLength': 'Password must be 8 characters long',
  'password.regex':
    'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
  'confirmPassword.required': 'Confirm password is required',
  'confirmPassword.sameAs': 'Confirm password must be same as password',
})

export const signupValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email', iLike: true })),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    key: vine.string().optional(),
  })
)
signupValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
  'email.database.unique': 'Email address is already in use',
  'password.required': 'Password is required',
  'password.minLength': 'Password must be 8 characters long',
  'password.regex':
    'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
})

export const personalInfoValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    company: vine.string().trim(),
    country: vine.string().trim(),
    phone: vine.string().trim().optional(),
    vatId: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim(),
    postalCode: vine.string().trim(),
  })
)
personalInfoValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'company.required': 'Company is required',
  'country.required': 'Country is required',
  'city.required': 'City is required',
  'postalCode.required': 'Postal code is required',
})

export const industryInfoValidator = vine.compile(
  vine.object({
    industry: vine.string().trim(),
  })
)
industryInfoValidator.messagesProvider = new SimpleMessagesProvider({
  'industry.required': 'Industry is required',
})

export const emailRegistrationValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    key: vine.string().optional(),
  })
)
emailRegistrationValidator.messagesProvider = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
})

export const referralSignupValidator = (id: number) =>
  vine.compile(
    vine.object({
      firstName: vine.string().trim(),
      lastName: vine.string().trim(),
      email: vine
        .string()
        .trim()
        .email()
        .use(uniqueWhenUpdateRule({ table: 'users', column: 'email', id, iLike: true })),
      password: vine
        .string()
        .trim()
        .minLength(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    })
  )

referralSignupValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
  'email.database.unique': 'Email address is already in use',
  'password.required': 'Password is required',
  'password.minLength': 'Password must be 8 characters long',
  'password.regex':
    'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
})
