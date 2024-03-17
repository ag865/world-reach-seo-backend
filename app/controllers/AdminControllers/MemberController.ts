import NotFoundException from '#exceptions/NotFoundException'
import { AuthServices, UserServices } from '#services/index'
import { signupValidator } from '#validators/AuthValidator'
import { updateMemberValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class MemberController {
  async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    await AuthServices.registerUser({ ...data, referralKey: cuid(), isAdmin: true })

    return response.json({ msg: 'Member created successfully!' })
  }

  async update({ request, response, params }: HttpContext) {
    const id = params.id as number

    let { avatar, ...requestData } = await request.validateUsing(updateMemberValidator(id))

    const user = await UserServices.getUserByValue('id', id)

    if (!user || !user.isAdmin) throw new NotFoundException('id', 'Member doest not exist')

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.extname}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    await UserServices.update(data, 'id', id)

    return response.json({ msg: 'Member updated successfully!' })
  }

  async get({ response, request }: HttpContext) {
    const { page, limit, search } = request.qs()

    const data = await UserServices.getUsers(page, limit, search)

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
