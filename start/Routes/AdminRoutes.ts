import CategoriesController from '#controllers/AdminControllers/CategoriesController'
import MemberController from '#controllers/AdminControllers/MemberController'
import UserController from '#controllers/AdminControllers/UserController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.resource('member', MemberController).apiOnly()
    router
      .group(() => {
        router.put('activate/:id', [UserController, 'activate'])
        router.put('de-activate/:id', [UserController, 'deActivate'])
        router.put('/:id', [UserController, 'update'])
        router.get('/', [UserController, 'get'])
        router.delete('/:id', [UserController, 'destroy'])
      })
      .prefix('user')

    router.resource('category', CategoriesController).apiOnly()
  })
  .prefix('/api/admin')
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
