import NotFoundException from '#exceptions/NotFoundException'
import SalesRepresentative from '#models/SalesRepresentative'
import User from '#models/User'

import { AuthServices, UserServices } from '#services/index'
import env from '#start/env'
import {
  loginValidator,
  resetPasswordValidator,
  signupValidator,
  updatePasswordValidator,
} from '#validators/AuthValidator'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  async clientLogin({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    const user = await AuthServices.loginUser(data.email, data.password, 'Client', true)

    if (user.stepNumber! < 6) {
      return response.json({ user })
    }

    if (!user.isActive)
      throw new NotFoundException(
        'email',
        'Your account is not activated yet! Please contact the administrator to activate your account!'
      )

    const token = await User.accessTokens.create(user)

    return response.json({ user, token })
  }

  async clientSignup({ request, response }: HttpContext) {
    const { key, ...data } = await request.validateUsing(signupValidator)

    let dataToCreate: any = {
      ...data,
      isActive: false,
      isVerified: false,
      referralKey: cuid(),
    }

    let referral: User | null = null

    if (key) {
      referral = await UserServices.getUserByValue('referralKey', key)

      if (referral) dataToCreate = { ...dataToCreate, referralId: referral.id }
    }

    const user = await AuthServices.registerUser(dataToCreate)

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

    let email = '',
      name = ''

    if (referral) {
      email = referral.email
      name = `${referral.firstName} ${referral.lastName}`
    } else {
      const salesRep = await SalesRepresentative.query().first()
      email = salesRep?.email ?? ''
      name = `${salesRep?.firstName} ${salesRep?.lastName}`
    }

    if (email) {
      await mail.send((message) => {
        message
          .to(email, name)
          .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
          .cc(email)
          .subject('New Referral Sign up')
          .htmlView('emails/referral_sign_up', {
            name: `${name}`,
            clientName: `${user.firstName} ${user.lastName}`,
            clientEmail: `${user.email}`,
            url: `${env.get('ADMIN_URL')}/users`,
          })
      })
    }

    await mail.send((message) => {
      message
        .to(env.get('COMPANY_EMAIL'), env.get('COMPANY_NAME'))
        .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
        .cc(env.get('COMPANY_EMAIL'))
        .subject('New Referral Sign up')
        .htmlView('emails/referral_sign_up', {
          name: `${name}`,
          clientName: `${user.firstName} ${user.lastName}`,
          clientEmail: `${user.email}`,
          url: `${env.get('ADMIN_URL')}/users`,
        })
    })

    return response.json({
      msg: 'Account created successfully, please check your mail inbox and verify your email address.',
    })
  }

  // async adminReferralSignup({ request, response, params }: HttpContext) {
  //   const { key } = params

  //   const user = await UserServices.getUserByValue('referralKey', key)

  //   if (!user || !user.isAdmin) throw new NotFoundException('key', 'Invalid referral key!')

  //   const data = await request.validateUsing(referralSignupValidator(user.id))

  //   const hashedPassword = await hash.make(data.password)

  //   await UserServices.update(
  //     {
  //       ...data,
  //       password: hashedPassword,
  //       referralKey: '',
  //       isActive: true,
  //       isVerified: true,
  //     },
  //     'id',
  //     user.id
  //   )

  //   return response.json({
  //     msg: 'Member signed up successfully, you can now login using your credentials!',
  //   })
  // }

  async getUserDetailsByReferralKey({ response, params }: HttpContext) {
    const { key } = params

    const user = await UserServices.getUserByValue('referralKey', key)

    if (!user || !user.isAdmin) throw new NotFoundException('key', 'Invalid Referral Key!')

    return response.json(user)
  }

  async clientResetPassword({ request, response }: HttpContext) {
    const data = await request.validateUsing(resetPasswordValidator)

    const user = await AuthServices.updateResetPasswordKey(data.email, 'Client')

    if (user)
      await mail.send((message) => {
        message
          .to(user.email, `${user.firstName} ${user.lastName}`)
          .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
          .cc(user.email)
          .subject('Reset your password')
          .htmlView('emails/recover_password_email_html', {
            url: `${env.get('CLIENT_URL')}/auth/recover-password/${user.resetPasswordKey}`,
            name: `${user.firstName} ${user.lastName}`,
            clientURL: env.get('CLIENT_URL'),
          })
      })

    return response.json({ msg: 'Reset password link has been sent to your email!' })
  }

  async updatePassword({ request, response, params }: HttpContext) {
    const { key } = params

    const user = await UserServices.getUserByValue('resetPasswordKey', key)

    if (!user) throw new NotFoundException('resetPasswordKey', 'Invalid recovery key!')

    const data = await request.validateUsing(updatePasswordValidator)

    const hashedPassword = await hash.make(data.password)

    await UserServices.update(
      { password: hashedPassword, resetPasswordKey: '', isActive: true },
      'id',
      user.id
    )

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

  async verifyAccount({ params, response }: HttpContext) {
    const { id } = params

    let user = await UserServices.getUserByValue('referralKey', id)

    if (!user) throw new NotFoundException('email', 'Invalid email address')

    await UserServices.update({ isVerified: true, stepNumber: 2 }, 'referralKey', id)

    user = await UserServices.getUserByValue('referralKey', id)

    return response.json(user)
  }
}
