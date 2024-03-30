import Category from '#models/Category'
import Website from '#models/Website'
import { getWebsites } from '#services/WebsiteServices'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import moment from 'moment'

const validator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()).optional(),
  })
)

const csvHeaders = [
  'Paid general price',
  'Paid casino price',
  'Selling price',
  'Selling casino price',
  'Paid erotic price',
  'Selling erotic price',
  'Paid crypto price',
  'Selling crypto price',
  'Old price',
  'Homepage link price',
  'Currency',
  'Domain',
  'Language',
  'Country',
  'Moz (DA)',
  'Ahrefs - DR',
  'Organic traffic',
  'Spam score',
  'Trust flow',
  'Domain age',
  'Semursh',
  'Referring domains',
  'Upload date',
  'Last updated',
  'Categories',
  'Homepage link',
  'Bazoom price',
  'Bazoom price gambling',
  'Bazoom price erotic',
  'Bazoom price crypto',
  'Accepts gambling',
  'Forex',
  'Sports betting',
  'Website email',
  'Old email',
  'Current email',
  'Loyal services',
  'Banner',
  'Notes',
]

export default class WebsiteExportController {
  async handle({ request, response }: HttpContext) {
    const params = request.qs()

    let data = await getWebsites(params, false)

    const csvData: string[][] = []

    data.map((d: Website) => {
      csvData.push([
        d.paidGeneralPrice?.toString(),
        d.paidCasinoPrice?.toString(),
        d.sellingGeneralPrice?.toString(),
        d.sellingCasinoPrice?.toString(),
        d.paidEroticPrice?.toString(),
        d.sellingEroticPrice?.toString(),
        d.paidCryptoPrice?.toString(),
        d.sellingCryptoPrice?.toString(),
        d.oldPrice?.toString(),
        d.homepageLinkPrice?.toString(),
        d.currency?.toString(),
        d.domain?.toString(),
        d.language?.toString(),
        d.country?.toString(),
        d.mozDA?.toString(),
        d.aHrefsDR?.toString(),
        d.organicTraffic?.toString(),
        d.spamScore?.toString(),
        d.trustFlow?.toString(),
        d.domainAge?.toString(),
        d.semursh?.toString(),
        d.referringDomain?.toString(),
        moment(d.createdAt).format('MM.DD.YYYY'),
        moment(d.updatedAt).format('MM.DD.YYYY'),
        d.categories.map((c: Category) => c.name).join(', '),
        d.homePageLink ? 'Yes' : 'No',
        d.bazoomPrice?.toString(),
        d.bazoomPriceGambling?.toString(),
        d.bazoomPriceErotic?.toString(),
        d.bazoomPriceCrypto?.toString(),
        d.acceptsGambling ? 'Yes' : 'No',
        d.acceptsForex ? 'Yes' : 'No',
        d.sportsBetting ? 'Yes' : 'No',
        d.websiteEmail?.toString(),
        d.oldEmail?.toString(),
        d.currentEmail?.toString(),
        d.loyalServices?.toString(),
        d.banner?.toString(),
        d.notes?.toString(),
      ])
    })

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(',')).join('\n')

    const fileName = `websites-export-${moment().format('YYYY-MM-DD')}.csv`

    await response.header('Content-Disposition', `attachment; filename=${fileName}`)

    response.header('Content-Type', 'text/csv')

    return response.send(csvContent)
  }
}
