import Project from '#models/Project'

const createProject = async (name: string, userId: number) => {
  return await Project.create({ name, userId })
}

const updatedProject = async (name: string, id: number) => {
  return await Project.query().update({ name }).where('id', id)
}

const deleteProject = async (id: number) => {
  return await Project.query().delete().where('id', id)
}

const getProjects = async (params: any) => {
  const { page = 1, limit = 10, sort = 'id', order = 'desc', search = '' } = params

  const query = Project.query()

  if (search) query.whereILike('name', `%${search}%`)

  return await query.orderBy(sort, order).paginate(page, limit)
}

const getProjectByValue = async (key: string, value: any, includePreloads: boolean = true) => {
  const query = Project.query().where({ [key]: value })

  if (includePreloads) {
    query.preload('favourites', (projectFavourites) => {
      projectFavourites.preload('favourite', (favourite) => {
        favourite.preload('website')
      })
    })
  }

  return await query.first()
}

const getProjectByValueWhereIdNotEqual = async (key: string, value: any, id: number) => {
  return await Project.query()
    .where({ [key]: value })
    .andWhereNot({ id })
    .first()
}

export {
  createProject,
  deleteProject,
  getProjectByValue,
  getProjectByValueWhereIdNotEqual,
  getProjects,
  updatedProject,
}
