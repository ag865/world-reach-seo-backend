import MemberController from '#controllers/AdminControllers/MemberController'
import UserController from '#controllers/AdminControllers/UserController'
import CategoriesController from '#controllers/CategoriesController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('/', [MemberController, 'create'])
        router.put('/:id', [MemberController, 'update'])
        router.get('/', [MemberController, 'get'])
        router.delete('/:id', [MemberController, 'destroy'])
      })
      .prefix('member')
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
