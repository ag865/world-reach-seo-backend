import CategoriesController from '#controllers/AdminControllers/CategoriesController'
import MemberController from '#controllers/AdminControllers/MemberController'
import PaymentApiSettingsController from '#controllers/AdminControllers/PaymentAPISettingController'
import SalesRepresentativesController from '#controllers/AdminControllers/SalesRepresentativesController'
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
    router
      .resource('sales-representative', SalesRepresentativesController)
      .apiOnly()
      .only(['index', 'store'])

    router
      .resource('payment-api-settings', PaymentApiSettingsController)
      .apiOnly()
      .only(['index', 'store'])
  })
  .prefix('/api/admin')
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
