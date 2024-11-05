import { ProjectServices } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectController {
  async store({ request, response, auth }: HttpContext) {
    const { name } = request.body()

    const userId = auth.user?.id

    if (!name)
      response.status(400).json({
        errors: [{ message: 'Project title is required!', field: 'name' }],
      })

    const newProject = await ProjectServices.createProject(name, userId!)

    return response.status(200).json({ msg: 'Project created successfully!', data: newProject })
  }

  async update({ request, response, auth, params }: HttpContext) {
    const { id } = params

    const { name } = request.body()

    const userId = auth.user?.id

    if (!name)
      response.status(400).json({
        errors: [{ message: 'Project title is required!', field: 'name' }],
      })

    const newProject = await ProjectServices.createProject(name, userId!)

    return response.status(200).json({ msg: 'Project created successfully!', data: newProject })
  }

  async delete({ request, response, auth, params }: HttpContext) {
    const { id } = params

    const { name } = request.body()

    const userId = auth.user?.id

    if (!name)
      response.status(400).json({
        errors: [{ message: 'Project title is required!', field: 'name' }],
      })

    const newProject = await ProjectServices.createProject(name, userId!)

    return response.status(200).json({ msg: 'Project created successfully!', data: newProject })
  }
}
