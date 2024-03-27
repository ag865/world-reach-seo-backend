import NotFoundException from '#exceptions/NotFoundException'
import Website from '#models/Website'
import { getWebsites } from '#services/WebsiteServices'
import { createWebsiteValidator, updateWebsiteValidator } from '#validators/WebsiteValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class WebsitesController {
  /**
   * Display a list of resource
   */
  async index(ctx: HttpContext) {
    const data = await getWebsites(ctx)
    return ctx.response.json(data)
  }

  async store({ request, response }: HttpContext) {
    const { categories, ...data } = await request.validateUsing(createWebsiteValidator)

    const website = await Website.create(data)

    if (categories) await website.related('categories').attach(categories)

    return response.json({ msg: 'Website created successfully' })
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params

    const website = await Website.findBy('id', id)

    if (!website) throw new NotFoundException()

    const { categories, ...data } = await request.validateUsing(updateWebsiteValidator(id))

    await Website.query()
      .update({ ...data })
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
