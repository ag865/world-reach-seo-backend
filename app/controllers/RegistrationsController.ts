import NotFoundException from '#exceptions/NotFoundException'
import User from '#models/User'
import { AuthServices, UserServices } from '#services/index'
import env from '#start/env'
import {
  emailRegistrationValidator,
  industryInfoValidator,
  personalInfoValidator,
  updatePasswordValidator,
} from '#validators/AuthValidator'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'

export default class RegistrationsController {
  async emailRegistration({ request, response }: HttpContext) {
    const { email, key } = await request.validateUsing(emailRegistrationValidator)

    const user = await UserServices.getUserByValue('email', email)

    //If User does not exist create a new user
    if (!user) {
      let dataToCreate: any = {
        firstName: '',
        lastName: '',
        email,
        stepNumber: 1,
        isActive: false,
        isVerified: false,
        referralKey: cuid(),
      }

      let referral: User | null = null

      if (key) {
        referral = await UserServices.getUserByValue('referralKey', key)

        if (referral) dataToCreate = { ...dataToCreate, referralId: referral.id }
      }

      const newUser = await AuthServices.registerUser(dataToCreate)

      await mail.send((message) => {
        message
          .to(newUser.email)
          .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
          .cc(newUser.email)
          .subject('Verify your email address')
          .htmlView('emails/verify_email_html', {
            url: `${env.get('CLIENT_URL')}/auth/registration/verify/${newUser.referralKey}`,
            clientURL: env.get('CLIENT_URL'),
          })
      })
      return response.json(newUser)
    }

    //if user exists and user is admin
    if (user?.isAdmin) {
      return response.status(400).json({ errors: [{ message: 'Email address is already taken' }] })
    }

    if (user!.stepNumber! >= 5) {
      return response.status(400).json({ errors: [{ message: 'Email address is already taken' }] })
    }

    //if user exists and have not verifies their email then we will send an email to verify
    if (user!.stepNumber === 1) {
      await mail.send((message) => {
        message
          .to(user!.email)
          .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
          .cc(user!.email)
          .subject('Verify your email address')
          .htmlView('emails/verify_email_html', {
            url: `${env.get('CLIENT_URL')}/auth/registration/verify/${user!.referralKey}`,
            // name: `${user!.firstName} ${user!.lastName}`,
            clientURL: env.get('CLIENT_URL'),
          })
      })
    }

    return response.json(user)
  }

  async savePassword({ request, response, params }: HttpContext) {
    const { id } = params

    const { password } = await request.validateUsing(updatePasswordValidator)

    const user = await UserServices.getUserByValue('id', id)

    const hashedPassword = await hash.make(password)

    if (!user) {
      throw new NotFoundException('User Not found!')
    }

    await UserServices.update({ password: hashedPassword, stepNumber: 3 }, 'id', id)

    return response.json({ msg: 'Password saved successfully!' })
  }

  async savePersonalInfo({ request, response, params }: HttpContext) {
    const { id } = params

    const data = await request.validateUsing(personalInfoValidator)

    const user = await UserServices.getUserByValue('id', id)

    if (!user) {
      throw new NotFoundException('User Not found!')
    }

    await UserServices.update({ ...data, stepNumber: 4 }, 'id', id)

    return response.json({ msg: 'Personal information saved successfully!' })
  }

  async saveIndustryInfo({ request, response, params }: HttpContext) {
    const { id } = params

    const { industry } = await request.validateUsing(industryInfoValidator)

    const user = await UserServices.getUserByValue('id', id)

    if (!user) {
      throw new NotFoundException('User Not found!')
    }

    await UserServices.update({ industry, stepNumber: 5 }, 'id', id)

    return response.json({ msg: 'Personal information saved successfully! You can login now!' })
  }

  async sendConfirmationEmail({ response, params }: HttpContext) {
    const { id } = params

    const user = await UserServices.getUserByValue('id', id)

    if (!user) {
      throw new NotFoundException('User Not found!')
    }

    await mail.send((message) => {
      message
        .to(user!.email)
        .from(env.get('SMTP_FROM_EMAIL'), 'World Reach Seo')
        .cc(user!.email)
        .subject('Verify your email address')
        .htmlView('emails/verify_email_html', {
          url: `${env.get('CLIENT_URL')}/auth/registration/verify/${user!.referralKey}`,
          // name: `${user!.firstName} ${user!.lastName}`,
          clientURL: env.get('CLIENT_URL'),
        })
    })

    return response.json({ msg: 'Confirmation email sent successfully!' })
  }
}
