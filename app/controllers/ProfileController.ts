import NotFoundException from '#exceptions/NotFoundException'
import { UserServices } from '#services/index'
import { updateMemberValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ProfileController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id
    const user = await UserServices.getUserByValue('id', userId)

    if (!user || !user.isAdmin) throw new NotFoundException('key', 'Profile not found')

    return response.json(user)
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id

    const user = await UserServices.getUserByValue('id', userId)

    if (!user || !user.isAdmin) throw new NotFoundException('id', 'Profile not found')

    let { avatar, ...requestData } = await request.validateUsing(updateMemberValidator(userId!))

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    await UserServices.update(data, 'id', userId)

    return response.json({ msg: 'Profile updated successfully!' })
  }
}
