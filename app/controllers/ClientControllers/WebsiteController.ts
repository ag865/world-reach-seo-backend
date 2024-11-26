import { getWebsites } from '#services/WebsiteServices'
import { UserServices } from '#services/index'
import { HttpContext } from '@adonisjs/core/http'

export default class WebsitesController {
  async get({ response, request, auth }: HttpContext) {
    let params = request.qs()

    const userId = auth.user?.id
    const { country } = params

    if (!country) {
      const user = await UserServices.getUserByValue('id', auth.user!.id!)

      let countries: string[] | undefined = undefined

      if (user?.countries.length) countries = user?.countries.map((country) => country.country)

      params = { ...params, country: countries }
    }

    const data = await getWebsites(params, true, false, false, userId)

    return response.json(data)
  }

  async getCount({ response, request, auth }: HttpContext) {
    let params = request.qs()

    const { country } = params

    let userId: any = undefined

    let data: any = {}

    if (!country) {
      const user = await UserServices.getUserByValue('id', auth.user!.id!)

      let countries: string[] | undefined = undefined

      if (user?.countries.length) countries = user?.countries.map((country) => country.country)

      params = { ...params, country: countries }

      userId = user?.id
    }

    data = await getWebsites(params, true, true, false, userId)

    return response.json({ count: data[0].$extras.count })
  }
}
