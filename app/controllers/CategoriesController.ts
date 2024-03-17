import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  /**
   * Get a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Handle for the create resource
   */
  async store({ request }: HttpContext) {}

  /**
   * Get individual record
   */
  async show({ params }: HttpContext) {}
  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
