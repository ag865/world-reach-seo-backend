import Category from '#models/Category'
import Website from '#models/Website'
import { getCountWebsites, getWebsites } from '#services/WebsiteServices'
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
  'Banner',
  'Banner price',
  'Insertion link',
  'Insertion link price',
  'Website email',
  'Upload date',
  'Last updated',
  'Banner notes',
  'Homepage link notes',
  'Admin notes',
  'User notes',
  'Hide',
]

export default class WebsiteExportController {
  async handle({ request, response }: HttpContext) {
    const params = request.qs()

    const count = await getCountWebsites(params)

    let data: Website[] = []

    const pages = Math.ceil(count / 100)

    for (let i = 0; i < pages; i++) {
      const websites = await getWebsites({ ...params, page: i + 1, limit: 100 }, true, false)
      data = [...data, ...websites]
    }

    const csvData: string[][] = []

    data.map((d: Website) => {
      let categories = ''

      if (d.categories.length) {
        d.categories.map((c: Category, index: number) => {
          if (index === d.categories.length - 1) {
            categories += c.name
          } else {
            categories += c.name + '| '
          }
        })
      }

      let formattedUploadDate = ''
      let formattedLastUpdatedDate = ''

      if (d.uploadDate)
        formattedUploadDate = `${String(d.uploadDate.getMonth() + 1).padStart(2, '0')}.${String(d.uploadDate.getDate()).padStart(2, '0')}.${d.uploadDate.getFullYear()}`

      if (d.lastUpdated)
        formattedLastUpdatedDate = `${String(d.lastUpdated.getMonth() + 1).padStart(2, '0')}.${String(d.lastUpdated.getDate()).padStart(2, '0')}.${d.lastUpdated.getFullYear()}`

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
        d.banner ? 'Yes' : 'No',
        d.bannerPrice ? d.bannerPrice?.toString() : '',
        d.insertionLink ? 'Yes' : 'No',
        d.insertionLinkPrice ? d.insertionLinkPrice?.toString() : '',
        d.websiteEmail ? d.websiteEmail?.toString() : '',
        d.uploadDate ? formattedUploadDate : d.createdAt.toFormat('MM.dd.yyyy'),
        d.lastUpdated ? formattedLastUpdatedDate : d.createdAt.toFormat('MM.dd.yyyy'),
        d.bannerNotes ? d.bannerNotes?.replace(/,/g, ';').toString() : '',
        d.homepageLinkNotes ? d.homepageLinkNotes?.replace(/,/g, ';').toString() : '',
        d.adminNotes ? d.adminNotes?.replace(/,/g, ';').toString() : '',
        d.clientNotes ? d.clientNotes?.replace(/,/g, ';').toString() : '',
        d.hide ? 'YES' : 'NO',
      ])
    })

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(',')).join('\n')

    const fileName = `websites-export-${moment().format('YYYY-MM-DD')}.csv`

    await response.header('Content-Disposition', `attachment; filename=${fileName}`)

    response.header('Content-Type', 'text/csv; charset=utf-8')

    return response.send('\uFEFF' + csvContent)
  }
}
