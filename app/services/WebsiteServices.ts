import Category from '#models/Category'
import Website from '#models/Website'
import string from '@adonisjs/core/helpers/string'
import { HttpContext } from '@adonisjs/core/http'

const addWebsites = async (data: any[]) => {
  const websites: any[] = []
  const categories: string[] = []

  for (var i = 0; i < data.length; i++) {
    const { categoriesNames, website } = createWebsiteObject(data[i])
    websites.push(website)
    categories.push(...categoriesNames)
  }

  const categoryObjects = await manageCategories(categories)

  await createWebsites(getSiteObjects(categoryObjects, websites))
}

const createWebsiteObject = (d: any) => {
  const categories = d['Categories']

  let categoriesNames: string[] = []

  if (categories) categoriesNames = [...categories.split(',')]

  const website = {
    paidGeneralPrice: d['Paid general price'],
    sellingGeneralPrice: d['Selling price'],
    paidCasinoPrice: d['Paid casino price'],
    sellingCasinoPrice: d['Selling casino price'],
    paidEroticPrice: d['Paid erotic price'],
    sellingEroticPrice: d['Selling erotic price'],
    paidCryptoPrice: d['Paid crypto price'],
    sellingCryptoPrice: d['Selling crypto price'],
    oldPrice: d['Old price'],
    homepageLinkPrice: d['Homepage link price'],
    mozDA: d['Moz (DA)'],
    aHrefsDR: d['Ahrefs - DR'],
    organicTraffic: d['Organic traffic'],
    spamScore: d['Spam score'],
    trustFlow: d['Trust flow'],
    semursh: d['Semursh'],
    referringDomain: d['Referring domains'],
    domainAge: d['Domain age'],
    bazoomPrice: d['Bazoom price'],
    bazoomPriceGambling: d['Bazoom price gambling'],
    bazoomPriceErotic: d['Bazoom price erotic'],
    bazoomPriceCrypto: d['Bazoom price crypto'],
    domain: d['Domain'],
    websiteEmail: d['Website email'],
    oldEmail: d['Old email'],
    currentEmail: d['Current email'],
    loyalServices: d['Loyal services'],
    banner: d['Banner'],
    notes: d['Notes'],
    currency: d['Currency'],
    language: d['Language'],
    country: d['Country'],
    homePageLink: d['Homepage link'],
    acceptsGambling: d['Accepts gambling'],
    acceptsForex: d['Forex'],
    sportsBetting: d['Sports betting'],
    categories: categoriesNames,
  }

  return {
    categoriesNames,
    website,
  }
}

const manageCategories = async (categories: string[]) => {
  const uniqueCategories = [...new Set(categories)]

  const categoryObjects = await getExistingCategories(uniqueCategories)

  const categoriesToCreate: string[] = []

  uniqueCategories.map((category) => {
    const categoryObject = categoryObjects.find((obj) => obj.name === category)
    if (!categoryObject) categoriesToCreate.push(category)
  })

  const newCategories = await createNewCategories(categoriesToCreate)

  return [...categoryObjects, ...newCategories]
}

const getExistingCategories = async (categoryNames: string[]) => {
  return await Category.query().where('name', 'IN', categoryNames)
}

const createNewCategories = async (categoryNames: string[]) => {
  return await Category.createMany(
    categoryNames.map((category) => {
      return {
        name: category,
        slug: string.slug(category),
      }
    })
  )
}

const getSiteObjects = (categoryObjects: Category[], websites: any[]) => {
  const sitesToCreate: any[] = []

  websites.map((website: any) => {
    const websiteCategoryIds: number[] = []
    if (website.categories) {
      website.categories.map((category: string) => {
        const id = categoryObjects.find((a) => a.name === category)!.id
        websiteCategoryIds.push(id)
      })
    }
    sitesToCreate.push({ ...website, categories: websiteCategoryIds })
  })

  return sitesToCreate
}

const getExistingSites = async (domains: string[]) => {
  return await Website.query().where('domain', 'IN', domains)
}

const createWebsites = async (websites: any[]) => {
  const existingWebsites = await getExistingSites(websites.map((website) => website.domain))

  const websitesToUpdate: any[] = []

  const websitesToCreate: any[] = []

  websites.map((website) => {
    const index = existingWebsites.findIndex(
      (existingWebsite) => existingWebsite.domain === website.domain
    )

    if (index < 0) websitesToCreate.push(website)
    else websitesToUpdate.push(website)
  })

  await createNewWebsites(websitesToCreate)
  await updateWebsites(websitesToUpdate, existingWebsites)
}

const createNewWebsites = async (websites: any[]) => {
  for (let i = 0; i < websites.length; i++) {
    const website = websites[i]

    let { categories, homePageLink, acceptsGambling, acceptsForex, sportsBetting, ...data } =
      website

    if (homePageLink) {
      if (homePageLink === 'Yes') data = { ...data, homePageLink: true }
      else data = { ...data, homePageLink: false }
    }

    if (acceptsGambling) {
      if (acceptsGambling === 'Yes') data = { ...data, acceptsGambling: true }
      else data = { ...data, acceptsGambling: true }
    }

    if (acceptsForex) {
      if (acceptsForex === 'Yes') data = { ...data, acceptsForex: true }
      else data = { ...data, acceptsForex: true }
    }

    if (sportsBetting) {
      if (sportsBetting === 'Yes') data = { ...data, sportsBetting: true }
      else data = { ...data, sportsBetting: true }
    }

    const newWebsite = await Website.create(data)

    await newWebsite.related('categories').attach(categories)
  }
}

const updateWebsites = async (websites: any[], existingWebsites: Website[]) => {
  for (let i = 0; i < websites.length; i++) {
    const website = websites[i]

    const existingWebsite = existingWebsites.find(
      (existingWebsite) => existingWebsite.domain === website.domain
    )!

    let { categories, homePageLink, acceptsGambling, acceptsForex, sportsBetting, ...data } =
      website

    if (homePageLink) {
      if (homePageLink === 'Yes') data = { ...data, homePageLink: true }
      else data = { ...data, homePageLink: false }
    }

    if (acceptsGambling) {
      if (acceptsGambling === 'Yes') data = { ...data, acceptsGambling: true }
      else data = { ...data, acceptsGambling: true }
    }

    if (acceptsForex) {
      if (acceptsForex === 'Yes') data = { ...data, acceptsForex: true }
      else data = { ...data, acceptsForex: true }
    }

    if (sportsBetting) {
      if (sportsBetting === 'Yes') data = { ...data, sportsBetting: true }
      else data = { ...data, sportsBetting: true }
    }

    await Website.query().update(data).where('id', existingWebsite.id)

    await existingWebsite.related('categories').sync(categories)
  }
}

const getWebsites = async (ctx: HttpContext) => {
  const {
    page = 1,
    limit = 10,
    sort = 'desc',
    order = 'id',
    language = '',
    country = '',
    category = '',
    niche = '',
    mozDaMin = 0,
    mozDaMax,
    spamScoreMin = 0,
    spamScoreMax,
    aHrefsDrMin = 0,
    aHrefsDrMax,
    priceMin = 0,
    priceMax,
    organicTrafficMin = 0,
    organicTrafficMax,
    semurshMin = 0,
    semurshMax,
    referringDomainsMin = 0,
    referringDomainsMax,
    homePageLink = false,
  } = ctx.request.qs()

  const query = Website.query().preload('categories')

  if (category) {
    query.whereHas('categories', (query) => {
      query.wherePivot('category_id', 'in', category)
    })
  }

  if (language) {
    const languages = typeof language === 'string' ? [language] : language
    query.andWhere('language', 'in', languages)
  }

  if (country) {
    const countries = typeof language === 'string' ? [country] : country
    query.andWhere('country', 'in', countries)
  }

  if (niche) {
    const niches = typeof niche === 'string' ? [niche] : niche
    if (niches.includes('casino')) query.andWhere('sellingCasinoPrice', '>', 0)
    if (niches.includes('crypto')) query.andWhere('sellingCryptoPrice', '>', 0)
    if (niches.includes('erotic')) query.andWhere('sellingEroticPrice', '>', 0)
  }

  if (mozDaMin) query.andWhere('moz_da', '>=', mozDaMin)

  if (mozDaMax) query.andWhere('moz_da', '<=', mozDaMax)

  if (spamScoreMin) query.andWhere('spam_score', '>=', spamScoreMin)

  if (spamScoreMax) query.andWhere('spam_score', '<=', spamScoreMax)

  if (aHrefsDrMin) query.andWhere('a_hrefs_dr', '>=', aHrefsDrMin)

  if (aHrefsDrMax) query.andWhere('a_hrefs_dr', '<=', aHrefsDrMax)

  if (organicTrafficMin) query.andWhere('organic_traffic', '>=', organicTrafficMin)

  if (organicTrafficMax) query.andWhere('organic_traffic', '<=', organicTrafficMax)

  if (semurshMin) query.andWhere('semursh', '>=', semurshMin)

  if (semurshMax) query.andWhere('semursh', '<=', semurshMax)

  if (referringDomainsMin) query.andWhere('referring_domain', '>=', referringDomainsMin)

  if (referringDomainsMax) query.andWhere('referring_domain', '<=', referringDomainsMax)

  if (priceMin) query.andWhere('selling_general_price', '>=', priceMin)

  if (priceMax) query.andWhere('selling_general_price', '<=', priceMax)

  if (homePageLink) query.andWhere('home_page_link', homePageLink)

  return await query.orderBy(sort, order).paginate(page, limit)
}

export { addWebsites, getWebsites }
