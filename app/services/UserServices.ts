import User from '#models/User'

const getUserByValue = async (column: string, value: any) => {
  return await User.findBy(column, value)
}

const create = async (data: any) => {
  return await User.create(data)
}

const update = async (data: any, updateByColumn: string, updateByValue: any) => {
  return await User.query().where(updateByColumn, updateByValue).update(data)
}

export { create, getUserByValue, update }
