import InvalidCredentialsException from '#exceptions/Auth/InvalidCredentialsException'
import InvalidUserTypeException from '#exceptions/Auth/InvalidUserTypeException'
import hash from '@adonisjs/core/services/hash'
import { generateRandomToken } from '../Utils/helpers.js'
import { UserServices } from './index.js'

const loginUser = async (email: string, password: string, userType: 'Admin' | 'Client') => {
  const user = await UserServices.getUserByValue('email', email)
  if (!user) throw new InvalidCredentialsException()
  if (userType === 'Admin' && !user?.isAdmin) throw new InvalidUserTypeException()
  if (userType === 'Client' && user?.isAdmin) throw new InvalidUserTypeException()

  const passwordMatched = await hash.verify(user.password, password)
  if (!passwordMatched) throw new InvalidCredentialsException('password')

  return user
}

const registerUser = async (data: any) => {
  await UserServices.create(data)
}

const updateResetPasswordKey = async (email: any, userType: 'Admin' | 'Client') => {
  const user = await UserServices.getUserByValue('email', email)

  if (userType === 'Admin' && !user?.isAdmin) throw new InvalidUserTypeException()
  if (userType === 'Client' && user?.isAdmin) throw new InvalidUserTypeException()

  let resetPasswordKey = ''
  let haveUniqueKey = false

  do {
    resetPasswordKey = generateRandomToken()

    const userWithKey = await UserServices.getUserByValue('resetPasswordKey', resetPasswordKey)
    if (!userWithKey) haveUniqueKey = true
  } while (!haveUniqueKey)

  await UserServices.update({ resetPasswordKey }, 'id', user?.id)
}

const updatePassword = async (password: string, id: number) => {
  await UserServices.update({ resetPasswordKey: '', password }, 'id', id)
}

export { loginUser, registerUser, updatePassword, updateResetPasswordKey }
