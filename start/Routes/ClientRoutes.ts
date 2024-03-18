import UserController from '#controllers/AdminControllers/UserController'
import AuthController from '#controllers/AuthController'
import ProfileController from '#controllers/ProfileController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('/', [ProfileController, 'store'])
        router.put('/reset-password', [UserController, 'resetPassword'])
        router.get('/', [ProfileController, 'index'])
      })
      .prefix('profile')

    router.post('/auth/logout', [AuthController, 'logout'])
  })
  .prefix('/api/user')
  .use([middleware.auth({ guards: ['api'] }), middleware.isClient()])
