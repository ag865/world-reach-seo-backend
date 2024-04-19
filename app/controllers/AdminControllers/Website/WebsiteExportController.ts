import Category from '#models/Category'
import Website from '#models/Website'
import { getWebsites } from '#services/WebsiteServices'
import { HttpContext } from '@adonisjs/core/http'
import moment from 'moment'

const csvHeaders = [
  'Paid general price',
  'Paid casino price',
  'Selling price',
  'Selling casino price',
  'Paid forex price',
  'Selling forex price',
  'Paid sports betting price',
  'Selling sports betting price',
  'Currency',
  'Language',
  'Country',
  'Domain',
  'Admin Notes',
  'User Notes',
  'Current email',
  'Categories',
  'Moz (DA)',
  'Ahrefs - DR',
  'Trust flow',
  'Spam score',
  'Organic traffic',
  'Accepts gambling',
  'Forex',
  'Sports betting',
  'Homepage link',
  'Homepage link notes',
  'Banner',
  'Banner notes',
  'Website email',
  'Upload date',
  'Last updated',
]

export default class WebsiteExportController {
  async handle({ request, response }: HttpContext) {
    const params = request.qs()

    let data = (await getWebsites(params, false, false)) as Website[]

    const csvData: string[][] = []

    data.map((d: Website) => {
      let categories = ''
      if (d.categories.length) {
        d.categories.map((c: Category, index: number) => {
          if (index === d.categories.length - 1) categories += c.name
          else categories += c.name + '| '
        })
      }
      console.log(categories)
      csvData.push([
        d.paidGeneralPrice ? d.paidGeneralPrice?.toString() : '',
        d.paidCasinoPrice ? d.paidCasinoPrice?.toString() : '',
        d.sellingGeneralPrice ? d.sellingGeneralPrice?.toString() : '',
        d.sellingCasinoPrice ? d.sellingCasinoPrice?.toString() : '',
        d.paidForexPrice ? d.paidForexPrice?.toString() : '',
        d.sellingForexPrice ? d.sellingForexPrice?.toString() : '',
        d.paidSportsBettingPrice ? d.paidSportsBettingPrice?.toString() : '',
        d.sellingSportsBettingPrice ? d.sellingSportsBettingPrice?.toString() : '',
        d.currency ? d.currency?.toString() : '',
        d.language ? d.language?.toString() : '',
        d.country ? d.country?.toString() : '',
        d.domain ? d.domain?.toString() : '',
        d.adminNotes ? d.adminNotes?.toString() : '',
        d.clientNotes ? d.clientNotes?.toString() : '',
        d.currentEmail ? d.currentEmail?.toString() : '',
        categories,
        d.mozDA ? d.mozDA?.toString() : '',
        d.aHrefsDR ? d.aHrefsDR?.toString() : '',
        d.trustFlow ? d.trustFlow?.toString() : '',
        d.spamScore ? d.spamScore?.toString() : '',
        d.organicTraffic ? d.organicTraffic?.toString() : '',
        d.acceptsGambling ? 'Yes' : 'No',
        d.acceptsForex ? 'Yes' : 'No',
        d.sportsBetting ? 'Yes' : 'No',
        d.homePageLink ? 'Yes' : 'No',
        d.homepageLinkNotes ? d.homepageLinkNotes?.toString() : '',
        d.banner ? d.banner?.toString() : '',
        d.bannerNotes ? d.bannerNotes?.toString() : '',
        d.websiteEmail ? d.websiteEmail?.toString() : '',
        d.createdAt ? moment(d.createdAt).format('MM.DD.YYYY') : '',
        d.updatedAt ? moment(d.updatedAt).format('MM.DD.YYYY') : '',
      ])
    })

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(',')).join('\n')

    const fileName = `websites-export-${moment().format('YYYY-MM-DD')}.csv`

    await response.header('Content-Disposition', `attachment; filename=${fileName}`)

    response.header('Content-Type', 'text/csv')

    return response.send(csvContent)
  }
}
