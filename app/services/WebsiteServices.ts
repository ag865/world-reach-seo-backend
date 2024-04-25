import Category from '#models/Category'
import Website from '#models/Website'
import string from '@adonisjs/core/helpers/string'

const addWebsites = async (data: any[]) => {
  const websites: any[] = []
  const categories: string[] = []

  for (var i = 0; i < data.length; i++) {
    const object = createWebsiteObject(data[i])
    if (object) {
      websites.push(object.website)
      categories.push(...object.categoriesNames)
    }
  }

  const categoryObjects = await manageCategories(categories)

  await createWebsites(getSiteObjects(categoryObjects, websites))
}

const getColumnData = (value: any) => {
  if (!value) return null
  const number = parseFloat(value)
  return isNaN(number) ? null : number
}

const getBooleanColumnData = (value: any) => {
  if (!value) return false
  if (value.toLowerCase() === 'yes') return true
  return false
}

const createWebsiteObject = (d: any) => {
  if (!d['Domain']) return null

  const categories = d['Categories']

  let categoriesNames: string[] = []

  if (categories) categoriesNames = [...categories.split(',')]

  const website = {
    paidGeneralPrice: getColumnData(d['Paid general price']),
    sellingGeneralPrice: getColumnData(d['Selling price']),
    paidCasinoPrice: getColumnData(d['Paid casino price']),
    sellingCasinoPrice: getColumnData(d['Selling casino price']),
    sellingSportsBettingPrice: getColumnData(d['Selling sports betting price']),
    paidSportsBettingPrice: getColumnData(d['Paid sports betting price']),
    paidForexPrice: getColumnData(d['Paid forex price']),
    sellingForexPrice: getColumnData(d['Selling forex price']),
    homepageLinkPrice: getColumnData(d['Homepage link price']),
    homepageLinkNotes: d['Homepage link notes'],
    mozDA: getColumnData(d['Moz (DA)']),
    aHrefsDR: getColumnData(d['Ahrefs - DR']),
    organicTraffic: getColumnData(d['Organic traffic']),
    spamScore: getColumnData(d['Spam score']),
    trustFlow: getColumnData(d['Trust flow']),
    domain: d['Domain'].toLowerCase(),
    websiteEmail: d['Website email'],
    currentEmail: d['Current email'],
    loyalServices: d['Loyal services'],
    bannerPrice: getColumnData(d['Banner price']),
    bannerNotes: d['Banner notes'],
    adminNotes: d['Admin notes'],
    clientNotes: d['User notes'],
    currency: d['Currency'],
    language: d['Language'],
    country: d['Country'],
    banner: getBooleanColumnData(d['Banner']),
    homePageLink: getBooleanColumnData(d['Homepage link']),
    acceptsGambling: getBooleanColumnData(d['Accepts gambling']),
    acceptsForex: getBooleanColumnData(d['Forex']),
    sportsBetting: getBooleanColumnData(d['Sports betting']),
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

    let { categories, ...data } = website

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

    let { categories, ...data } = website

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
    ids = '',
    search = '',
  } = params

  const query = Website.query()

  if (!getCount) query.preload('categories')

  if (search) query.andWhereILike('domain', `%${search}%`)

  if (ids) {
    const websiteIds = typeof ids === 'string' ? [ids] : ids
    query.where('id', 'IN', websiteIds)
  }

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
