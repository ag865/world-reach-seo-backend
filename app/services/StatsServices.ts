import Website from '#models/Website'
import moment from 'moment'
import { AHREFS_API_TOKEN } from '../../utils/constants.js'
import { getStatTrend } from '../../utils/helpers.js'
import { StatsAPIServices } from './index.js'

const getSemrushStats = async (website: Website) => {
  try {
    const { domain, semrushAs } = website

    const semrushASResponse = await StatsAPIServices.getSemrushAPIResponse(domain)

    let dataToUpdate: any = {}

    if (semrushASResponse) {
      let semrushTrend = getStatTrend(semrushAs, semrushASResponse)

      dataToUpdate = {
        semrushAs: semrushASResponse,
        semrushTrend,
      }
    }

    return dataToUpdate
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getMozStats = async (website: Website) => {
  try {
    const { domain, spamScore, mozDA } = website

    const mozResponse = await StatsAPIServices.getMozAPIResponse(domain)

    let dataToReturn: any = {}

    if (mozResponse.spamScore) {
      const spamScoreResponse = mozResponse.spamScore

      const mozSpamScoreTrend = getStatTrend(spamScore, mozResponse.spamScore)

      dataToReturn = { spamScore: spamScoreResponse, mozSpamScoreTrend }
    }

    if (mozResponse.mozDA) {
      const mozDAResponse = mozResponse.mozDA

      const mozDaTrend = getStatTrend(mozDA, mozResponse.mozDA)

      dataToReturn = { ...dataToReturn, mozDA: mozDAResponse, mozDaTrend }
    }

    return dataToReturn
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsStats = async (website: Website) => {
  const { aHrefsDR } = website

  const date = moment().format('YYYY-MM-DD')

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${AHREFS_API_TOKEN}`,
  }

  const params = {
    target: website.domain,
    date,
    output: 'json',
  }

  let dataToReturn: any = {}

  const aHrefsDRResponse = await StatsAPIServices.getAhrefsDomainRatingsAPIResponse(params, headers)
  if (aHrefsDRResponse) {
    const ahrefsTrend = getStatTrend(aHrefsDR, aHrefsDRResponse)
    dataToReturn = { aHrefsDR: aHrefsDRResponse, ahrefsTrend }
  }

  const referringDomain = await StatsAPIServices.getAhrefsReferringDomainsAPIResponse(
    params,
    headers
  )
  if (referringDomain) {
    dataToReturn = { ...dataToReturn, referringDomain }
  }

  const linkedRootDomains = await StatsAPIServices.getAhrefsLinkedRootDomainsAPIResponse(
    params,
    headers
  )
  if (referringDomain) {
    dataToReturn = { ...dataToReturn, linkedRootDomains }
  }

  const organicTraffic = await StatsAPIServices.getAhrefsOrganicTrafficAPIResponse(params, headers)
  if (organicTraffic) {
    dataToReturn = { ...dataToReturn, ...organicTraffic }
  }

  return dataToReturn
}

const getAhrefsOrganicTrafficHistory = async (target: string) => {
  const startDate = moment().subtract(2, 'years').format('YYYY-MM-DD')

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${AHREFS_API_TOKEN}`,
  }

  const params = {
    target: target,
    date_from: startDate,
    history_grouping: 'weekly',
    output: 'json',
  }

  const history = await StatsAPIServices.getAhrefsOrganicTrafficHistoryAPIResponse(params, headers)
  if (history && history.length) {
    return history.map((entry: any) => ({
      date: entry.date as string,
      organicTraffic: entry.org_traffic as number,
    }))
  }
}

export { getAhrefsOrganicTrafficHistory, getAhrefsStats, getMozStats, getSemrushStats }
