import NotFoundException from '#exceptions/NotFoundException'
import Website from '#models/Website'
import { S3Service } from '#services/index'
import { getWebsites } from '#services/WebsiteServices'
import { createWebsiteValidator, updateWebsiteValidator } from '#validators/WebsiteValidator'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class WebsitesController {
  async index({ request, response }: HttpContext) {
    const params = request.qs()

    const data = await getWebsites(params, true, false)

    return response.json(data)
  }

  async store({ request, response }: HttpContext) {
    const { categories, ...data } = await request.validateUsing(createWebsiteValidator)

    const screenshotUrl = await S3Service.uploadWebsiteScreenshot(data.domain)

    let dataToSave: any = {
      ...data,
      domain: data.domain.toLowerCase(),
      uploadDate: data.uploadDate ? new Date(data.uploadDate) : undefined,
      lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : undefined,
    }

    if (screenshotUrl) {
      dataToSave = {
        ...dataToSave,
        screenshotDate: new Date(),
        screenshotUrl,
      }
    }

    const website = await Website.create({
      ...dataToSave,
    })

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
        uploadDate: data.uploadDate ? DateTime.fromJSDate(data.uploadDate) : undefined,
        lastUpdated: data.lastUpdated ? DateTime.fromJSDate(data.lastUpdated) : undefined,
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
