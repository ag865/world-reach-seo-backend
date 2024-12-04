import axios from 'axios'
import {
  MOZ_API_KEY,
  MOZ_API_URL,
  SEMRUSH_API_KEY,
  SEMRUSH_API_URL,
} from '../../utils/constants.js'

const getSemrushStats = async (domain: string) => {
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

    return parseInt(response.data.split('\n')[1])
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

const getMozStats = async (domain: string) => {
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

    let dataToReturn: any = {}

    if (response.data.result.site_metrics.spam_score) {
      dataToReturn = { spamScore: response.data.result.site_metrics.spam_score }
    }

    if (response.data.result.site_metrics.domain_authority) {
      dataToReturn = {
        ...dataToReturn,
        mozDA: response.data.result.site_metrics.domain_authority,
      }
    }

    return dataToReturn
  } catch (e) {
    console.log('ERROR', e)
    return undefined
  }
}

export { getMozStats, getSemrushStats }
