import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const SalesRepresentativeValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine.string().trim().email(),
    avatar: vine
      .file({
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
      .optional(),
  })
)

SalesRepresentativeValidator.messagesProvider = new SimpleMessagesProvider({
  'firstName.required': 'First name is required',
  'lastName.required': 'Last name is required',
  'email.required': 'Email is required',
  'email.email': 'Invalid email address',
  'avatar.file.extname': 'Please upload an image file',
})
