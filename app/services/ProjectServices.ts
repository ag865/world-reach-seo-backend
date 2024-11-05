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

const getProjectById = async (id: number) => {
  return await Project.query()
    .where({ id })
    .preload('favourites', (projectFavourites) => {
      projectFavourites.preload('favourite', (favourite) => {
        favourite.preload('website')
      })
    })
}

export { createProject, deleteProject, getProjectById, getProjects, updatedProject }
