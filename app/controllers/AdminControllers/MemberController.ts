import NotFoundException from '#exceptions/NotFoundException'
import { AuthServices, UserServices } from '#services/index'
import { createMemberValidator, updateMemberValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'

export default class MemberController {
  async store({ request, response }: HttpContext) {
    let { avatar, ...requestData } = await request.validateUsing(createMemberValidator)

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.clientName}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    const hashedPassword = await hash.make(data.password)

    await AuthServices.registerUser({
      ...data,
      referralKey: cuid(),
      isAdmin: true,
      isActive: true,
      password: hashedPassword,
      isVerified: true,
      stepNumber: 6,
    })

    return response.json({ msg: 'Member created successfully!' })
  }

  async update({ request, response, params }: HttpContext) {
    const id = params.id as number

    let { avatar, ...requestData } = await request.validateUsing(updateMemberValidator(id))

    const user = await UserServices.getUserByValue('id', id)

    if (!user || !user.isAdmin) throw new NotFoundException('id', 'Member doest not exist')

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.clientName}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    if (data.password) {
      const hashedPassword = await hash.make(data.password)
      data = { ...data, password: hashedPassword }
    }

    await UserServices.update(data, 'id', id)

    return response.json({ msg: 'Member updated successfully!' })
  }

  async index({ response, request }: HttpContext) {
    const { page, limit, search, sort = 'id', order = 'desc' } = request.qs()

    const data = await UserServices.getUsers(page, limit, search, true, sort, order)

    return response.json(data)
  }

  async destroy({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || !user.isAdmin) throw new NotFoundException('id', 'Member doest not exist')

    await UserServices.destroy(id)

    return response.json({ msg: 'Member deleted successfully' })
  }
}
