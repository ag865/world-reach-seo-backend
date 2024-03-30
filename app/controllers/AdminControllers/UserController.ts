import InvalidCredentialsException from '#exceptions/Auth/InvalidCredentialsException'
import NotFoundException from '#exceptions/NotFoundException'
import UserCountry from '#models/UserCountry'
import { UserServices } from '#services/index'
import { updatePasswordValidator, updateUserValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'

export default class UserController {
  async update({ request, response, params }: HttpContext) {
    const id = params.id as number

    let { avatar, countries, ...requestData } = await request.validateUsing(updateUserValidator)

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.clientName}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    await UserServices.update(data, 'id', id)

    await UserCountry.query().where('userId', id).delete()

    if (countries) {
      const countriesToUpdate = countries?.map((country) => ({
        country,
      }))
      await user.related('countries').createMany(countriesToUpdate)
    }

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
    const { page, limit, search, sort = 'id', order = 'desc' } = request.qs()

    const data: any = await UserServices.getUsers(page, limit, search, false, sort, order)

    return response.json(data)
  }

  async destroy({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'Member doest not exist')

    await UserServices.destroy(id)

    return response.json({ msg: 'Member deleted successfully' })
  }

  async resetPassword({ response, request, auth }: HttpContext) {
    const userId = auth.user?.id

    const data = await request.validateUsing(updatePasswordValidator)

    const user = await UserServices.getUserByValue('id', userId)
    if (!user) throw new NotFoundException('id', 'User not found')

    const passwordMatched = await hash.verify(user.password, data.currentPassword)
    if (!passwordMatched) throw new InvalidCredentialsException('password')

    const hashedPassword = await hash.make(data.password)

    await UserServices.update({ password: hashedPassword }, 'id', user.id)

    return response.json({ msg: 'Password updated successfully!' })
  }
}
