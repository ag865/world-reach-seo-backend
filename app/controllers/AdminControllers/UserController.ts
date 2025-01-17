import InvalidCredentialsException from '#exceptions/Auth/InvalidCredentialsException'
import NotFoundException from '#exceptions/NotFoundException'
import User from '#models/User'
import UserCountry from '#models/UserCountry'
import { UserServices } from '#services/index'
import env from '#start/env'
import { updatePasswordValidator, updateUserValidator } from '#validators/MembersValidators'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'

export default class UserController {
  async update({ request, response, params }: HttpContext) {
    const id = params.id as number

    let { avatar, countries, password, ...requestData } =
      await request.validateUsing(updateUserValidator)

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    let data: any = requestData

    if (avatar) {
      const fileName = `${cuid()}.${avatar.clientName}`
      await avatar.move(app.makePath('uploads'), { name: fileName })
      data = { ...data, avatar: fileName }
    }

    if (password) {
      const hashedPassword = await hash.make(password)
      data = { ...data, password: hashedPassword }
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

    await mail.send((message) => {
      message
        .to(user.email, `${user.firstName} ${user.lastName}`)
        .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
        .cc(user.email)
        .subject('Marketplace account activation')
        .htmlView('emails/activate_account_email_html', {
          url: `${env.get('CLIENT_URL')}/auth/login`,
          name: `${user.firstName} ${user.lastName}`,
          email: `${user.email}`,
        })
    })

    return response.json({ msg: 'User activated successfully!' })
  }

  async verify({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    await UserServices.update({ isVerified: true }, 'id', id)

    return response.json({ msg: 'User verified successfully!' })
  }

  async deActivate({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    await UserServices.update({ isActive: false }, 'id', id)

    return response.json({ msg: 'User deactivated successfully!' })
  }

  async resendVerificationEmail({ response, params }: HttpContext) {
    const id = params.id as number

    const user = await UserServices.getUserByValue('id', id)

    if (!user || user.isAdmin) throw new NotFoundException('id', 'User doest not exist')

    await mail.send((message) => {
      message
        .to(user.email, `${user.firstName} ${user.lastName}`)
        .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
        .cc(user.email)
        .subject('Verify your email address')
        .htmlView('emails/verify_email_html', {
          url: `${env.get('CLIENT_URL')}/auth/registration/verify/${user.referralKey}`,
          name: `${user.firstName} ${user.lastName}`,
          clientURL: env.get('CLIENT_URL'),
        })
    })

    return response.json({ msg: 'Verification Email Sent Successfully!' })
  }

  async get({ response, request }: HttpContext) {
    const {
      page,
      limit,
      search,
      sort = 'id',
      order = 'desc',
      referralId = undefined,
      status = '',
    } = request.qs()

    const data: any = await UserServices.getUsers(
      page,
      limit,
      search,
      false,
      sort,
      order,
      referralId,
      status
    )

    return response.json(data)
  }

  async getUser({ response, params }: HttpContext) {
    const { id } = params

    const data = await User.query().where('id', id).andWhere('isAdmin', false).firstOrFail()

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

    const passwordMatched = await hash.verify(user.password!, data.currentPassword)
    if (!passwordMatched) throw new InvalidCredentialsException('password')

    const hashedPassword = await hash.make(data.password)

    await UserServices.update({ password: hashedPassword }, 'id', user.id)

    return response.json({ msg: 'Password updated successfully!' })
  }
}
