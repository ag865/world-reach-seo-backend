import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

const PAYPAL_ID = env.get('PAYPAL_ID')
const PAYPAL_SECRET = env.get('PAYPAL_SECRET')
const PAYPAL_URL = env.get('PAYPAL_URL')

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_ID || !PAYPAL_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS')
    }
    const auth = Buffer.from(PAYPAL_ID + ':' + PAYPAL_SECRET).toString('base64')
    const response = await fetch(`${PAYPAL_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    const data: any = await response.json()

    return data.access_token
  } catch (error) {
    console.error('Failed to generate Access Token:', error)
  }
}

async function handleResponse(response: any) {
  try {
    const jsonResponse = await response.json()
    return {
      jsonResponse,
      httpStatusCode: response.status,
    }
  } catch (err) {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
  }
}

export default class PaypalController {
  async store({ response, request }: HttpContext) {
    const { cart } = request.body()
    const accessToken = await generateAccessToken()

    const url = `${PAYPAL_URL}/v2/checkout/orders`
    const payload = {
      intent: 'CAPTURE',
      purchase_units: cart,
    }

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const { httpStatusCode, jsonResponse } = await handleResponse(res)
    return response.status(httpStatusCode).json(jsonResponse)
  }
  async update({ response, params }: HttpContext) {
    const { id } = params
    console.log({ id })
    const accessToken = await generateAccessToken()
    const url = `${PAYPAL_URL}/v2/checkout/orders/${id}/capture`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const { httpStatusCode, jsonResponse } = await handleResponse(res)

    return response.status(httpStatusCode).json(jsonResponse)
  }
}
