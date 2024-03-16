import NotFoundException from '#exceptions/NotFoundException'
import User from '#models/User'

import { AuthServices, UserServices } from '#services/index'
import {
  loginValidator,
  resetPasswordValidator,
  signupValidator,
  updatePasswordValidator,
} from '#validators/Auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async clientLogin({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const user = await AuthServices.loginUser(data.email, data.password, 'Client')
    const token = await User.accessTokens.create(user)
    return response.json({ user, token })
  }

  async clientSignup({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)
    await AuthServices.registerUser({ ...data, isActive: false })
    return response.json({ msg: 'User signed up successfully' })
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
    await AuthServices.updatePassword(data.password, user.id)
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
    const token = await User.accessTokens.create(user)
    return response.json({ user, token })
  }
}
