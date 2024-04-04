import UserController from '#controllers/AdminControllers/UserController'
import AuthController from '#controllers/AuthController'
import BillingAddressController from '#controllers/ClientControllers/BillingAddressController'
import CartsController from '#controllers/ClientControllers/CartController'
import CategoryController from '#controllers/ClientControllers/CategoryController'
import OrdersController from '#controllers/ClientControllers/OrdersController'
import SalesRepresentativesController from '#controllers/ClientControllers/SalesRepresentativeController'
import WebsitesController from '#controllers/ClientControllers/WebsiteController'
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

    router.resource('billing-address', BillingAddressController).apiOnly().only(['index', 'store'])

    router
      .group(() => {
        router.get('/', [WebsitesController, 'get'])
        router.get('/count', [WebsitesController, 'getCount'])
      })
      .prefix('website')

    router.get('sales-representative', [SalesRepresentativesController])

    router.get('/category', [CategoryController])

    router.resource('/cart', CartsController).apiOnly().only(['index', 'store'])

    router.resource('/order', OrdersController).apiOnly().except(['destroy'])
  })
  .prefix('/api/user')
  .use([middleware.auth({ guards: ['api'] }), middleware.isClient()])
