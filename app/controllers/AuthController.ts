import NotFoundException from '#exceptions/NotFoundException'
import User from '#models/User'

import { AuthServices, UserServices } from '#services/index'
import {
  loginValidator,
  referralSignupValidator,
  resetPasswordValidator,
  signupValidator,
  updatePasswordValidator,
} from '#validators/AuthValidator'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async clientLogin({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    const user = await AuthServices.loginUser(data.email, data.password, 'Client')

    if (!user.isActive) throw new NotFoundException('email', 'Account is not active')

    const token = await User.accessTokens.create(user)

    return response.json({ user, token })
  }

  async clientSignup({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    await AuthServices.registerUser({ ...data, isActive: false })

    return response.json({ msg: 'User signed up successfully' })
  }

  async adminReferralSignup({ request, response, params }: HttpContext) {
    const { key } = params

    const user = await UserServices.getUserByValue('referralKey', key)

    if (!user || !user.isAdmin) throw new NotFoundException('key', 'Member not found')

    const data = await request.validateUsing(referralSignupValidator(user.id))

    const hashedPassword = await hash.make(data.password)

    await UserServices.update(
      {
        ...data,
        password: hashedPassword,
        referralKey: '',
        isActive: true,
      },
      'id',
      user.id
    )

    return response.json({ msg: 'Member signed up successfully' })
  }

  async getUserDetailsByReferralKey({ response, params }: HttpContext) {
    const { key } = params

    const user = await UserServices.getUserByValue('referralKey', key)

    if (!user || !user.isAdmin) throw new NotFoundException('key', 'Member not found')

    return response.json(user)
  }

  async clientResetPassword({ request, response }: HttpContext) {
    const data = await request.validateUsing(resetPasswordValidator)

    await AuthServices.updateResetPasswordKey(data.email, 'Client')

    return response.json({ msg: 'Reset password link has been sent to your email!' })
  }

  async updatePassword({ request, response, params }: HttpContext) {
    const { key } = params

    const user = await UserServices.getUserByValue('resetPasswordKey', key)

    if (!user) throw new NotFoundException('resetPasswordKey', 'User not found')

    const data = await request.validateUsing(updatePasswordValidator)

    const hashedPassword = await hash.make(data.password)

    await UserServices.update({ password: hashedPassword, resetPasswordKey: '' }, 'id', user.id)

    return response.json({
      msg: 'Your account password has been reset now you can login using your new credentials!',
    })
  }

  async adminResetPassword({ request, response }: HttpContext) {
    const data = await request.validateUsing(resetPasswordValidator)

    await AuthServices.updateResetPasswordKey(data.email, 'Admin')

    return response.json({ msg: 'Reset password link has been sent to your email!' })
  }

  async adminLogin({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    const user = await AuthServices.loginUser(data.email, data.password, 'Admin')

    if (!user.isActive) throw new NotFoundException('email', 'Account is not active')

    const token = await User.accessTokens.create(user)

    return response.json({ user, token })
  }

  async logout({ response, auth }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new NotFoundException('userId', 'User not found')

    const user = await UserServices.getUserByValue('id', userId)

    await User.accessTokens.delete(user!, userId)

    return response.json({ msg: 'Successfully logged out' })
  }
}
