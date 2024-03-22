import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const billingAddressValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    email: vine.string().trim().email().optional(),
    businessName: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().optional(),
    country: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
  })
)
billingAddressValidator.messagesProvider = new SimpleMessagesProvider({
  'email.email': 'Invalid email address',
})
