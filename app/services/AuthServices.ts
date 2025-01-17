import ForbiddenAccessException from '#exceptions/Auth/ForbiddenAccessException'
import InvalidCredentialsException from '#exceptions/Auth/InvalidCredentialsException'
import { cuid } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { UserServices } from './index.js'

const loginUser = async (
  email: string,
  password: string,
  userType: 'Admin' | 'Client',
  checkVerification?: boolean
) => {
  const user = await UserServices.getUserByValue('email', email)
  if (!user) throw new InvalidCredentialsException()
  if (userType === 'Admin' && !user?.isAdmin) throw new ForbiddenAccessException()
  if (userType === 'Client' && user?.isAdmin) throw new ForbiddenAccessException()
  if (checkVerification && !user?.isVerified)
    throw new ForbiddenAccessException('email', 'Please verify your email address')

  const passwordMatched = await hash.verify(user.password!, password)
  if (!passwordMatched) throw new InvalidCredentialsException('password')

  return user
}

const registerUser = async (data: any) => {
  return await UserServices.create(data)
}

const updateResetPasswordKey = async (email: any, userType: 'Admin' | 'Client') => {
  const user = await UserServices.getUserByValue('email', email)

  if (userType === 'Admin' && !user?.isAdmin) throw new ForbiddenAccessException()
  if (userType === 'Client' && user?.isAdmin) throw new ForbiddenAccessException()

  await UserServices.update({ resetPasswordKey: cuid(), isActive: false }, 'id', user?.id)

  return await UserServices.getUserByValue('email', email)
}

const updatePassword = async (password: string, id: number) => {
  await UserServices.update({ resetPasswordKey: '', password }, 'id', id)
}

export { loginUser, registerUser, updatePassword, updateResetPasswordKey }
