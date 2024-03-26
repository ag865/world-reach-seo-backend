import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ImageController {
  async download({ params, response }: HttpContext) {
    const { key } = params

    const absolutePath = app.makePath('uploads', key)

    return response.download(absolutePath)
  }
}
