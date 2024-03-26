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

export { addWebsites }
