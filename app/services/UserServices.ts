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

const destroy = async (id: number) => {
  return await User.query().where('id', id).delete()
}

const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  isAdmin: boolean = true
) => {
  return await User.query()
    .where('isAdmin', isAdmin)
    .andWhere((query) => {
      query
        .whereRaw("LOWER(first_name || ' ' || last_name) LIKE ?", [`%${search.toLowerCase()}%`])
        .orWhere('email', 'ILIKE', `%${search}%`)
    })
    .orderBy('id', 'desc')
    .paginate(page, limit)
}

export { create, destroy, getUserByValue, getUsers, update }
