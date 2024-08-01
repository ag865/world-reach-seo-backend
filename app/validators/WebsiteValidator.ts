import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule, uniqueWhenUpdateRule } from './rules/unique.js'

const createWebsiteValidator = vine.compile(
  vine.object({
    domain: vine
      .string()
      .trim()
      .url()
      .use(uniqueRule({ table: 'websites', column: 'domain', iLike: true })),

    paidGeneralPrice: vine.number().optional(),
    sellingGeneralPrice: vine.number().optional(),
    paidCasinoPrice: vine.number().optional(),
    sellingCasinoPrice: vine.number().optional(),
    sellingSportsBettingPrice: vine.number().optional(),
    paidSportsBettingPrice: vine.number().optional(),
    paidForexPrice: vine.number().optional(),
    sellingForexPrice: vine.number().optional(),
    homepageLinkPrice: vine.number().optional(),
    homepageLinkNotes: vine.string().optional(),

    mozDA: vine.number().optional(),
    aHrefsDR: vine.number().optional(),
    organicTraffic: vine.number().optional(),
    spamScore: vine.number().optional(),
    trustFlow: vine.number().optional(),

    websiteEmail: vine.string().trim().email().optional(),
    currentEmail: vine.string().trim().optional(),
    loyalServices: vine.string().trim().optional(),
    bannerPrice: vine.number().optional(),
    banner: vine.boolean().optional(),
    bannerNotes: vine.string().trim().optional(),
    adminNotes: vine.string().trim().optional(),
    clientNotes: vine.string().trim().optional(),

    homePageLink: vine.boolean().optional(),
    acceptsGambling: vine.boolean().optional(),
    acceptsForex: vine.boolean().optional(),
    sportsBetting: vine.boolean().optional(),

    currency: vine.string().trim().optional(),
    language: vine.string().trim().optional(),
    country: vine.string().trim().optional(),

    insertionLink: vine.boolean().optional(),
    insertionLinkPrice: vine.number().optional(),
    hide: vine.boolean().optional(),

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
        .use(uniqueWhenUpdateRule({ table: 'websites', column: 'domain', id, iLike: true })),

      paidGeneralPrice: vine.number().optional(),
      sellingGeneralPrice: vine.number().optional(),
      paidCasinoPrice: vine.number().optional(),
      sellingCasinoPrice: vine.number().optional(),
      sellingSportsBettingPrice: vine.number().optional(),
      paidSportsBettingPrice: vine.number().optional(),
      paidForexPrice: vine.number().optional(),
      sellingForexPrice: vine.number().optional(),
      homepageLinkPrice: vine.number().optional(),
      homepageLinkNotes: vine.string().optional(),

      mozDA: vine.number().optional(),
      aHrefsDR: vine.number().optional(),
      organicTraffic: vine.number().optional(),
      spamScore: vine.number().optional(),
      trustFlow: vine.number().optional(),

      websiteEmail: vine.string().trim().email().optional(),
      currentEmail: vine.string().trim().optional(),
      loyalServices: vine.string().trim().optional(),
      bannerPrice: vine.number().optional(),
      banner: vine.boolean().optional(),
      bannerNotes: vine.string().trim().optional(),
      insertionLink: vine.boolean().optional(),
      insertionLinkPrice: vine.number().optional(),
      adminNotes: vine.string().trim().optional(),
      clientNotes: vine.string().trim().optional(),

      homePageLink: vine.boolean().optional(),
      acceptsGambling: vine.boolean().optional(),
      acceptsForex: vine.boolean().optional(),
      sportsBetting: vine.boolean().optional(),

      currency: vine.string().trim().optional(),
      language: vine.string().trim().optional(),
      country: vine.string().trim().optional(),
      hide: vine.boolean().optional(),

      categories: vine.array(vine.number()).optional(),
    })
  )

updateWebsiteValidator.messagesProvider = new SimpleMessagesProvider({
  'domain.required': 'Domain name is required',
  'domain.url': 'Domain name must be URL of a website',
  'domain.unique': 'Domain name already exists',
})

export { createWebsiteValidator, updateWebsiteValidator }
