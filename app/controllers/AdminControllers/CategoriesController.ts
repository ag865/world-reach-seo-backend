import NotFoundException from '#exceptions/NotFoundException'
import Category from '#models/Category'

import { categoryCreateValidator, categoryUpdateValidator } from '#validators/CategoryValidator'
import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  /**
   * Get a list of resource
   */
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '', sort = 'name', order = 'desc' } = request.qs()

    const data = await Category.query()
      .whereILike('name', `%${search}%`)
      .orWhereILike('slug', `%${search}%`)
      .orderBy(sort, order)
      .paginate(page, limit)

    return response.json(data)
  }

  /**
   * Handle for the create resource
   */
  async store({ response, request }: HttpContext) {
    const data = await request.validateUsing(categoryCreateValidator)

    await Category.create({ name: data.name, slug: string.slug(data.name) })

    return response.json({
      msg: 'Category created successfully',
    })
  }

  /**
   * Get individual record
   */
  async show({ params, response }: HttpContext) {
    const { id } = params

    const category = await Category.findBy('id', id)

    if (!category) throw new NotFoundException('id', 'Category doest not exist')

    return response.json(category)
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ response, params, request }: HttpContext) {
    const { id } = params

    const category = await Category.findBy('id', id)

    if (!category) throw new NotFoundException('id', 'Category doest not exist')

    const data = await request.validateUsing(categoryUpdateValidator(id))

    category.name = data.name
    category.slug = string.slug(data.name)

    await category.save()

    return response.json({
      msg: 'Category updated successfully',
    })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const category = await Category.findBy('id', id)

    if (!category) throw new NotFoundException('id', 'Category doest not exist')

    await category.delete()

    return response.json({
      msg: 'Category deleted successfully',
    })
  }
}
