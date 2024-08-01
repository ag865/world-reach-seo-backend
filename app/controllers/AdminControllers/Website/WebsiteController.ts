import NotFoundException from '#exceptions/NotFoundException'
import Website from '#models/Website'
import { getWebsites } from '#services/WebsiteServices'
import { createWebsiteValidator, updateWebsiteValidator } from '#validators/WebsiteValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class WebsitesController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const params = request.qs()

    const data = await getWebsites(params, true, false)

    return response.json(data)
  }

  async store({ request, response }: HttpContext) {
    const { categories, ...data } = await request.validateUsing(createWebsiteValidator)

    const website = await Website.create({ ...data, domain: data.domain.toLowerCase() })

    if (categories) await website.related('categories').attach(categories)

    return response.json({ msg: 'Website created successfully' })
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    const website = await Website.findBy('id', id)

    if (!website) throw new NotFoundException()

    const { categories, ...data } = await request.validateUsing(updateWebsiteValidator(id))

    await Website.query()
      .update({
        domain: data.domain.toLowerCase(),
        paidGeneralPrice: data.paidGeneralPrice ?? null,
        sellingGeneralPrice: data.sellingGeneralPrice ?? null,
        paidCasinoPrice: data.paidCasinoPrice ?? null,
        sellingCasinoPrice: data.sellingCasinoPrice ?? null,
        paidSportsBettingPrice: data.paidSportsBettingPrice ?? null,
        sellingSportsBettingPrice: data.sellingSportsBettingPrice ?? null,
        paidForexPrice: data.paidForexPrice ?? null,
        sellingForexPrice: data.sellingForexPrice ?? null,
        homepageLinkPrice: data.homepageLinkPrice ?? null,
        homepageLinkNotes: data.homepageLinkNotes ?? null,
        mozDA: data.mozDA ?? null,
        aHrefsDR: data.aHrefsDR ?? null,
        organicTraffic: data.organicTraffic ?? null,
        spamScore: data.spamScore ?? null,
        trustFlow: data.trustFlow ?? null,
        websiteEmail: data.websiteEmail ?? null,
        currentEmail: data.currentEmail ?? null,
        banner: data.banner ?? null,
        bannerPrice: data.bannerPrice ?? null,
        bannerNotes: data.bannerNotes ?? null,
        adminNotes: data.adminNotes ?? null,
        clientNotes: data.clientNotes ?? null,
        homePageLink: data.homePageLink ?? null,
        insertionLink: data.insertionLink ?? null,
        insertionLinkPrice: data.insertionLinkPrice ?? null,
        acceptsGambling: data.acceptsGambling ?? null,
        acceptsForex: data.acceptsForex ?? null,
        sportsBetting: data.sportsBetting ?? null,
        currency: data.currency ?? null,
        language: data.language ?? null,
        country: data.country ?? null,
        hide: data.hide ?? null,
      })
      .where('id', id)

    if (categories) await website!.related('categories').sync(categories)

    return response.json({ msg: 'Website updated successfully' })
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const data = await Website.findBy('id', id)

    if (!data) throw new NotFoundException('id', 'Website not found')

    await data.delete()

    return response.json({ msg: 'Website deleted successfully!' })
  }
}
