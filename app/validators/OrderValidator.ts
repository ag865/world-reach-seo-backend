import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { existsRule } from './rules/exists.js'

const createOrderValidator = vine.compile(
  vine.object({
    poNumber: vine.string().trim().optional(),
    billingAddressFirstName: vine.string().trim().optional(),
    billingAddressLastName: vine.string().trim().optional(),
    billingAddressBusinessName: vine.string().trim().optional(),
    billingAddressEmail: vine.string().trim().email().optional(),
    billingAddressAddress: vine.string().trim().optional(),
    billingAddressCity: vine.string().trim().optional(),
    billingAddressPostalCode: vine.string().trim().optional(),
    billingAddressCountry: vine.string().trim().optional(),
    paymentMethod: vine.string().trim(),
    totalAmount: vine.number(),
    details: vine
      .array(
        vine.object({
          websiteId: vine.number().use(existsRule({ column: 'id', table: 'websites' })),
          customId: vine.string().trim().optional(),
          restrictedNiche: vine.string().trim(),
          words: vine.number().optional(),
          contentByMarketplace: vine.boolean(),
          totalPrice: vine.number(),
          contentPrice: vine.number(),
          mediaPrice: vine.number(),
          status: vine.string(),
        })
      )
      .minLength(1),
  })
)

createOrderValidator.messagesProvider = new SimpleMessagesProvider({
  // 'billingAddressFirstName.required': 'Billing first name is required',
  // 'billingAddressLastName.required': 'Billing last name is required',
  // 'billingAddressBusinessName.required': 'Billing business name is required',
  // 'billingAddressEmail.email': 'Invalid billing email address',
  // 'billingAddressEmail.required': 'Billing email is required',
  // 'billingAddressAddress.required': 'Billing address is required',
  // 'billingAddressCity.required': 'Billing city is required',
  // 'billingAddressPostalCode.required': 'Billing postal code is required',
  // 'billingAddressCountry.required': 'Billing country is required',
  'totalAmount.required': 'Total amount is required',
  'paymentMethod.required': 'Payment method is required',
  'details.array.minLength': 'Select at least one website to proceed',
  'details.*.websiteId.required': 'Website not selected',
  'details.*.websiteId.existsRule': 'Invalid website selected',
  'details.*.restrictedNiche.required': 'Restrict website to a niche',
  'details.*.totalPrice.required': 'Total price for media is required ',
  'details.*.contentPrice.required': 'Content price for media is required ',
  'details.*.mediaPrice.required': 'Media price for media is required ',
  'details.*.status': 'Website status is required',
  'details.*.contentByMarketplace': 'Content By Marketplace status is required',
})

export { createOrderValidator }
