import NotFoundException from '#exceptions/NotFoundException'
import Favourite from '#models/Favourite'
import ProjectFavourite from '#models/ProjectFavourite'
import { ProjectServices, WebsiteServices } from '#services/index'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavouritesController {
  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id!

    const { websiteId, projectId } = request.body()

    let dataToSave: any = { websiteId, userId }

    //Checking if the website is coming
    if (!websiteId) {
      return response.status(400).json({
        errors: [{ message: 'Website is required!', field: 'websiteId' }],
      })
    }

    //Checking if the website exists
    const website = await WebsiteServices.getWebsite('id', websiteId)
    if (!website) {
      throw new NotFoundException('websiteId', 'Website not found!')
    }

    //Checking if the project exists
    if (projectId) {
      const project = await ProjectServices.getProjectByValue('id', projectId, false)
      if (!project) {
        throw new NotFoundException('projectId', 'Project not found!')
      }
    }

    let favouriteId = null

    //checking if the favourite exists then don't create it otherwise create it
    const favourite = await Favourite.query()
      .where('userId', userId)
      .andWhere('websiteId', websiteId)
      .first()

    if (favourite) {
      favouriteId = favourite.id
    } else {
      const newFavourite = await Favourite.create(dataToSave)
      favouriteId = newFavourite.id
    }

    if (projectId) {
      await ProjectFavourite.create({ favouriteId, projectId })
    }

    return response.status(200).json({ msg: 'Website marked as favourite!' })
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const data = await Favourite.findBy('id', id)

    if (!data) throw new NotFoundException('id', 'Favourite not found!')

    await data.delete()

    return response.status(200).json({ msg: 'Website removed as favourite!' })
  }

  async destroyProjectFavourite({ params, response }: HttpContext) {
    const { id } = params

    const data = await ProjectFavourite.findBy('id', id)

    if (!data) throw new NotFoundException('id', 'Favourite not found!')

    await data.delete()

    return response.status(200).json({ msg: 'Website removed as favourite!' })
  }
}
