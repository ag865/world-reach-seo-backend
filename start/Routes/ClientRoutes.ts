import UserController from '#controllers/AdminControllers/UserController'
import ProfilesController from '#controllers/ProfileController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.put('profile/reset-password', [UserController, 'resetPassword'])
    router
      .group(() => {
        router.post('/', [ProfilesController, 'store'])
        router.get('/', [ProfilesController, 'index'])
      })
      .prefix('profile')
  })
  .prefix('/api/user')
  .use([middleware.auth({ guards: ['api'] }), middleware.isClient()])
