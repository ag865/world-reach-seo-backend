import { ProjectServices } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectController {
  async store({ request, response, auth }: HttpContext) {
    const { name } = request.body()

    const userId = auth.user?.id
    if (!name) {
      return response.status(400).json({
        errors: [{ message: 'Project title is required!', field: 'name' }],
      })
    }

    const project = await ProjectServices.getProjectByValue('name', name, false)
    if (project) {
      return response.status(400).json({
        errors: [{ message: 'Project title already exists!', field: 'name' }],
      })
    }

    const newProject = await ProjectServices.createProject(name, userId!)

    return response.status(200).json({ msg: 'Project created successfully!', data: newProject })
  }

  async update({ request, response, params }: HttpContext) {
    const { id } = params

    const { name } = request.body()
    if (!name)
      return response.status(400).json({
        errors: [{ message: 'Project title is required!', field: 'name' }],
      })

    const project = await ProjectServices.getProjectByValueWhereIdNotEqual('name', name, id)
    if (project) {
      return response.status(400).json({
        errors: [{ message: 'Project title already exists!', field: 'name' }],
      })
    }

    await ProjectServices.updatedProject(name, id)

    return response.status(200).json({ msg: 'Project updated successfully!' })
  }

  async destroy({ response, params }: HttpContext) {
    const { id } = params

    await ProjectServices.deleteProject(id)

    return response.status(200).json({ msg: 'Project deleted successfully!' })
  }

  async index({ request, response }: HttpContext) {
    const params = request.qs()

    const data = await ProjectServices.getProjects(params)

    return response.status(200).json(data)
  }

  async show({ response, params }: HttpContext) {
    const { id } = params

    const data = await ProjectServices.getProjectByValue('id', id)

    return response.status(200).json(data)
  }
}
