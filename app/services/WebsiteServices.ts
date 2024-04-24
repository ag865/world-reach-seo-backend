import Category from '#models/Category'
import Website from '#models/Website'
import string from '@adonisjs/core/helpers/string'

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
    sellingSportsBettingPrice: d['Selling sports betting price'],
    paidSportsBettingPrice: d['Paid sports betting price'],
    paidForexPrice: d['Paid forex price'],
    sellingForexPrice: d['Selling forex price'],
    homepageLinkPrice: d['Homepage link price'],
    homepageLinkNotes: d['Homepage link notes'],
    mozDA: d['Moz (DA)'],
    aHrefsDR: d['Ahrefs - DR'],
    organicTraffic: d['Organic traffic'],
    spamScore: d['Spam score'],
    trustFlow: d['Trust flow'],
    domain: d['Domain'],
    websiteEmail: d['Website email'],
    currentEmail: d['Current email'],
    loyalServices: d['Loyal services'],
    banner: d['Banner'],
    bannerPrice: d['Banner price'],
    bannerNotes: d['Banner notes'],
    adminNotes: d['Admin notes'],
    clientNotes: d['User notes'],
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

    let {
      categories,
      homePageLink,
      acceptsGambling,
      acceptsForex,
      sportsBetting,
      banner,
      ...data
    } = website

    if (homePageLink) {
      if (homePageLink.toLowerCase() === 'yes') data = { ...data, homePageLink: true }
      else data = { ...data, homePageLink: false }
    }

    if (acceptsGambling) {
      if (acceptsGambling.toLowerCase() === 'yes') data = { ...data, acceptsGambling: true }
      else data = { ...data, acceptsGambling: false }
    }

    if (acceptsForex) {
      if (acceptsForex.toLowerCase() === 'yes') data = { ...data, acceptsForex: true }
      else data = { ...data, acceptsForex: false }
    }

    if (sportsBetting) {
      if (sportsBetting.toLowerCase() === 'yes') data = { ...data, sportsBetting: true }
      else data = { ...data, sportsBetting: false }
    }

    if (banner) {
      if (banner.toLowerCase() === 'yes') data = { ...data, banner: true }
      else data = { ...data, banner: false }
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

    let {
      categories,
      homePageLink,
      acceptsGambling,
      acceptsForex,
      sportsBetting,
      banner,
      ...data
    } = website

    if (homePageLink) {
      if (homePageLink.toLowerCase() === 'yes') data = { ...data, homePageLink: true }
      else data = { ...data, homePageLink: false }
    }

    if (acceptsGambling) {
      if (acceptsGambling.toLowerCase() === 'yes') data = { ...data, acceptsGambling: true }
      else data = { ...data, acceptsGambling: false }
    }

    if (acceptsForex) {
      if (acceptsForex.toLowerCase() === 'yes') data = { ...data, acceptsForex: true }
      else data = { ...data, acceptsForex: false }
    }

    if (sportsBetting) {
      if (sportsBetting.toLowerCase() === 'yes') data = { ...data, sportsBetting: true }
      else data = { ...data, sportsBetting: false }
    }

    if (banner) {
      if (banner.toLowerCase() === 'yes') data = { ...data, banner: true }
      else data = { ...data, banner: false }
    }

    await Website.query().update(data).where('id', existingWebsite.id)

    await existingWebsite.related('categories').sync(categories)
  }
}

const getWebsites = async (params: any, paginate = true, getCount = false) => {
  const {
    page = 1,
    limit = 10,
    sort = 'id',
    order = 'desc',
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
    homePageLink = false,
    banner = false,
    ids = [],
    search = '',
  } = params

  const query = Website.query()

  if (!getCount) query.preload('categories')

  if (search) query.andWhereILike('domain', `%${search}%`)

  if (ids && ids.length) query.where('id', 'IN', ids)

  if (category) {
    const categories = typeof category === 'string' ? [category] : category
    query.whereHas('categories', (query) => {
      query.whereInPivot('category_id', categories)
    })
  }

  if (language) {
    const languages = typeof language === 'string' ? [language] : language
    query.andWhereIn('language', languages)
  }

  if (country) {
    const countries = typeof country === 'string' ? [country] : country
    query.andWhereIn('country', countries)
  }

  if (niche) {
    const niches = typeof niche === 'string' ? [niche] : niche
    if (niches.includes('Gambling')) query.andWhere('acceptsGambling', true)
    if (niches.includes('Forex')) query.andWhere('acceptsForex', true)
    if (niches.includes('Sports Betting')) query.andWhere('sportsBetting', true)
  }

  if (mozDaMin) query.andWhere('moz_da', '>=', mozDaMin)

  if (mozDaMax) query.andWhere('moz_da', '<=', mozDaMax)

  if (spamScoreMin) query.andWhere('spam_score', '>=', spamScoreMin)

  if (spamScoreMax) query.andWhere('spam_score', '<=', spamScoreMax)

  if (aHrefsDrMin) query.andWhere('a_hrefs_dr', '>=', aHrefsDrMin)

  if (aHrefsDrMax) query.andWhere('a_hrefs_dr', '<=', aHrefsDrMax)

  if (organicTrafficMin) query.andWhere('organic_traffic', '>=', organicTrafficMin)

  if (organicTrafficMax) query.andWhere('organic_traffic', '<=', organicTrafficMax)

  if (priceMin) query.andWhere('selling_general_price', '>=', priceMin)

  if (priceMax) query.andWhere('selling_general_price', '<=', priceMax)

  if (homePageLink && homePageLink !== 'None')
    query.andWhere('home_page_link', homePageLink.toLowerCase())

  if (banner && banner !== 'None') query.andWhere('banner', banner.toLowerCase())

  if (getCount) return await query.count('id')

  if (paginate) return await query.orderBy(sort, order).paginate(page, limit)

  return await query.orderBy(sort, order)
}

export { addWebsites, getWebsites }
