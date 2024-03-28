import Website from '#models/Website'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)

export default class WebsiteMultipleDeleteController {
  async handle({ request, response }: HttpContext) {
    let { ids } = await request.validateUsing(validator)

    await Website.query().where('id', 'IN', ids).delete()

    return response.json({ msg: 'Websites deleted successfully!' })
  }
}
