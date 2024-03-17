import NotFoundException from '#exceptions/NotFoundException'
import { UserServices } from '#services/index'
import { updateUserValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UserController {
  async update({ request, response, params }: HttpContext) {
    const id = params.id as number

    let { avatar, ...requestData } = await request.validateUsing(updateUserValidator)

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    await UserServices.update(data, 'id', id)

    return response.json({ msg: 'User updated successfully!' })
  }

  async activate({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    await UserServices.update({ isActive: true }, 'id', id)

    return response.json({ msg: 'User activated successfully!' })
  }

  async deActivate({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    await UserServices.update({ isActive: false }, 'id', id)

    return response.json({ msg: 'User deactivated successfully!' })
  }

  async get({ response, request }: HttpContext) {
    const { page, limit, search } = request.qs()

    const data = await UserServices.getUsers(page, limit, search, false)

    return response.json(data)
  }

  async destroy({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'Member doest not exist')

    await UserServices.destroy(id)

    return response.json({ msg: 'Member deleted successfully' })
  }
}
