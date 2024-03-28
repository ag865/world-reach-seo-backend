import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule, uniqueWhenUpdateRule } from './rules/unique.js'

const createWebsiteValidator = vine.compile(
  vine.object({
    domain: vine
      .string()
      .trim()
      .url()
      .use(uniqueRule({ table: 'websites', column: 'domain' })),

    paidGeneralPrice: vine.number().optional(),
    sellingGeneralPrice: vine.number().optional(),
    paidCasinoPrice: vine.number().optional(),
    sellingCasinoPrice: vine.number().optional(),
    paidEroticPrice: vine.number().optional(),
    sellingEroticPrice: vine.number().optional(),
    paidCryptoPrice: vine.number().optional(),
    sellingCryptoPrice: vine.number().optional(),
    oldPrice: vine.number().optional(),
    homepageLinkPrice: vine.number().optional(),

    bazoomPrice: vine.number().optional(),
    bazoomPriceGambling: vine.number().optional(),
    bazoomPriceErotic: vine.number().optional(),
    bazoomPriceCrypto: vine.number().optional(),

    domainAge: vine.number().optional(),

    mozDA: vine.number().optional(),
    aHrefsDR: vine.number().optional(),
    organicTraffic: vine.number().optional(),
    spamScore: vine.number().optional(),
    trustFlow: vine.number().optional(),
    semursh: vine.number().optional(),
    referringDomain: vine.number().optional(),

    websiteEmail: vine.string().trim().email().optional(),
    oldEmail: vine.string().trim().email().optional(),
    currentEmail: vine.string().trim().email().optional(),
    loyalServices: vine.string().trim().optional(),
    banner: vine.string().trim().optional(),
    notes: vine.string().trim().optional(),

    homePageLink: vine.boolean().optional(),
    acceptsGambling: vine.boolean().optional(),
    acceptsForex: vine.boolean().optional(),
    sportsBetting: vine.boolean().optional(),

    currency: vine.string().trim().optional(),
    language: vine.string().trim().optional(),
    country: vine.string().trim().optional(),

    categories: vine.array(vine.number()).optional(),
  })
)

createWebsiteValidator.messagesProvider = new SimpleMessagesProvider({
  'domain.required': 'Domain name is required',
  'domain.url': 'Domain name must be URL of a website',
  'domain.unique': 'Domain name already exists',
})

const updateWebsiteValidator = (id: number) =>
  vine.compile(
    vine.object({
      domain: vine
        .string()
        .trim()
        .url()
        .use(uniqueWhenUpdateRule({ table: 'websites', column: 'domain', id })),

      paidGeneralPrice: vine.number().optional(),
      sellingGeneralPrice: vine.number().optional(),
      paidCasinoPrice: vine.number().optional(),
      sellingCasinoPrice: vine.number().optional(),
      paidEroticPrice: vine.number().optional(),
      sellingEroticPrice: vine.number().optional(),
      paidCryptoPrice: vine.number().optional(),
      sellingCryptoPrice: vine.number().optional(),
      oldPrice: vine.number().optional(),
      homepageLinkPrice: vine.number().optional(),

      bazoomPrice: vine.number().optional(),
      bazoomPriceGambling: vine.number().optional(),
      bazoomPriceErotic: vine.number().optional(),
      bazoomPriceCrypto: vine.number().optional(),

      domainAge: vine.number().optional(),

      mozDA: vine.number().optional(),
      aHrefsDR: vine.number().optional(),
      organicTraffic: vine.number().optional(),
      spamScore: vine.number().optional(),
      trustFlow: vine.number().optional(),
      semursh: vine.number().optional(),
      referringDomain: vine.number().optional(),

      websiteEmail: vine.string().trim().email().optional(),
      oldEmail: vine.string().trim().email().optional(),
      currentEmail: vine.string().trim().email().optional(),
      loyalServices: vine.string().trim().optional(),
      banner: vine.string().trim().optional(),
      notes: vine.string().trim().optional(),

      homePageLink: vine.boolean().optional(),
      acceptsGambling: vine.boolean().optional(),
      acceptsForex: vine.boolean().optional(),
      sportsBetting: vine.boolean().optional(),

      currency: vine.string().trim().optional(),
      language: vine.string().trim().optional(),
      country: vine.string().trim().optional(),

      categories: vine.array(vine.number()).optional(),
    })
  )

updateWebsiteValidator.messagesProvider = new SimpleMessagesProvider({
  'domain.required': 'Domain name is required',
  'domain.url': 'Domain name must be URL of a website',
  'domain.unique': 'Domain name already exists',
})

export { createWebsiteValidator, updateWebsiteValidator }
