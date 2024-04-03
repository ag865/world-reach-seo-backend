import User from '#models/User'

const getUserByValue = async (column: string, value: any) => {
  return await User.query().where(column, value).preload('countries').first()
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
  isAdmin: boolean = true,
  sort: string = 'id',
  order: 'asc' | 'desc' = 'desc'
) => {
  const query = User.query()
    .preload('countries')
    .where('isAdmin', isAdmin)
    .andWhere((query) => {
      query
        .whereRaw("LOWER(first_name || ' ' || last_name) LIKE ?", [`%${search.toLowerCase()}%`])
        .orWhereILike('email', `%${search}%`)
    })

  const sortColumns = sort.split(',')

  sortColumns.map((sortColumn) => {
    query.orderBy(sortColumn, order)
  })

  return await query.paginate(page, limit)
}

export { create, destroy, getUserByValue, getUsers, update }
