import NotFoundException from '#exceptions/NotFoundException'
import { S3Service, UserServices } from '#services/index'
import { updateMemberValidator } from '#validators/MembersValidators'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user?.id

    const user = await UserServices.getUserByValue('id', userId)

    if (!user) throw new NotFoundException('key', 'Profile not found')

    return response.json(user)
  }

  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id

    const user = await UserServices.getUserByValue('id', userId)

    if (!user) throw new NotFoundException('id', 'Profile not found')

    let { avatar, ...requestData } = await request.validateUsing(updateMemberValidator(userId!))

    let data: any = requestData

    if (avatar) {
      const publicUrl = await S3Service.uploadAvatar(avatar)
      data = { ...data, avatar: publicUrl }
    }

    await UserServices.update(data, 'id', userId)

    return response.json({ msg: 'Profile updated successfully!' })
  }
}
