import Category from '#models/Category'
import { HttpContext } from '@adonisjs/core/http'

export default class CategoryController {
  async handle({ response, request }: HttpContext) {
    const { page = 1, limit = 10, search = '', sort = 'name', order = 'desc' } = request.qs()

    const data = await Category.query()
      .whereILike('name', `%${search}%`)
      .orWhereILike('slug', `%${search}%`)
      .orderBy(sort, order)
      .paginate(page, limit)

    return response.json(data)
  }
}
