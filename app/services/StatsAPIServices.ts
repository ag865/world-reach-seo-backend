import axios from 'axios'
import {
  AHREFS_API_BASE_URL,
  MOZ_API_KEY,
  MOZ_API_URL,
  SEMRUSH_API_KEY,
  SEMRUSH_API_URL,
} from '../../utils/constants.js'
import { getCountryNameFromISOCode } from '../../utils/isoCountryCodes.js'

const getMozAPIResponse = async (domain: string) => {
  try {
    const response = await axios.post(
      MOZ_API_URL,
      {
        jsonrpc: '2.0',
        id: '7d399660-5225-4763-a6d1-f2101e42dd48',
        method: 'data.site.metrics.fetch',
        params: {
          data: {
            site_query: {
              query: domain,
              scope: 'domain',
            },
          },
        },
      },
      {
        headers: {
          'x-moz-token': MOZ_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    const { spam_score, domain_authority } = response.data.result.site_metrics

    let data: any = {}

    if (spam_score) {
      data = { spamScore: spam_score }
    }

    if (spam_score) {
      data = { ...data, mozDA: domain_authority }
    }

    return data
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getSemrushAPIResponse = async (domain: string) => {
  try {
    const response = await axios.get(SEMRUSH_API_URL, {
      params: {
        type: 'backlinks_overview',
        key: SEMRUSH_API_KEY,
        target: domain,
        target_type: 'root_domain',
        export_columns: 'ascore',
      },
      responseType: 'json',
    })

    const semrushAS = response.data.split('\n')[1]

    return parseInt(semrushAS)
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsDomainRatingsAPIResponse = async (params: any, headers: any) => {
  try {
    const API_URL = `${AHREFS_API_BASE_URL}/domain-rating`

    const response = await axios.get(API_URL, {
      headers,
      params,
    })
    return response.data.domain_rating.domain_rating
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsReferringDomainsAPIResponse = async (params: any, headers: any) => {
  try {
    const API_URL = `${AHREFS_API_BASE_URL}/backlinks-stats`

    const response = await axios.get(API_URL, {
      headers,
      params,
    })

    return response.data.metrics.live_refdomains
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsLinkedRootDomainsAPIResponse = async (params: any, headers: any) => {
  try {
    const API_URL = `${AHREFS_API_BASE_URL}/outlinks-stats`

    const response = await axios.get(API_URL, {
      headers,
      params,
    })

    return response.data.metrics.linked_domains
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsOrganicTrafficAPIResponse = async (params: any, headers: any) => {
  try {
    const API_URL = `${AHREFS_API_BASE_URL}/metrics-by-country`

    const response = await axios.get(API_URL, {
      headers,
      params,
    })

    const metrics = response.data.metrics as any[]
    if (metrics.length) {
      const data = metrics.sort((a, b) => b.org_traffic - a.org_traffic)
      const country = getCountryNameFromISOCode(data[0].country)

      return { organicTraffic: data[0].org_traffic, country }
    } else {
      return undefined
    }
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getAhrefsOrganicTrafficHistoryAPIResponse = async (params: any, headers: any) => {
  try {
    const API_URL = `${AHREFS_API_BASE_URL}/metrics-history`

    const response = await axios.get(API_URL, {
      headers,
      params,
    })

    return response.data.metrics as any[]
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

export {
  getAhrefsDomainRatingsAPIResponse,
  getAhrefsLinkedRootDomainsAPIResponse,
  getAhrefsOrganicTrafficAPIResponse,
  getAhrefsOrganicTrafficHistoryAPIResponse,
  getAhrefsReferringDomainsAPIResponse,
  getMozAPIResponse,
  getSemrushAPIResponse,
}
