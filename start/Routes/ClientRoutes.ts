import UserController from '#controllers/AdminControllers/UserController'
import AuthController from '#controllers/AuthController'
import BillingAddressController from '#controllers/ClientControllers/BillingAddressController'
import CartsController from '#controllers/ClientControllers/CartController'
import CategoryController from '#controllers/ClientControllers/CategoryController'
import CouponController from '#controllers/ClientControllers/CouponController'
import FavouritesController from '#controllers/ClientControllers/FavouritesController'
import NotificationsController from '#controllers/ClientControllers/NotificationsController'
import OrdersController from '#controllers/ClientControllers/OrdersController'
import PaypalController from '#controllers/ClientControllers/PaypalController'
import ProjectController from '#controllers/ClientControllers/ProjectController'
import SalesRepresentativesController from '#controllers/ClientControllers/SalesRepresentativeController'
import StripesController from '#controllers/ClientControllers/StripeController'
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
        router.get('/organic-traffic/:id', [WebsitesController, 'getOrganicTraffic'])
      })
      .prefix('website')

    router.get('sales-representative', [SalesRepresentativesController])

    router.get('/category', [CategoryController])

    router.resource('/cart', CartsController).apiOnly().only(['index', 'store'])

    router.resource('/order', OrdersController).apiOnly().except(['destroy'])

    router.resource('/stripe', StripesController).apiOnly().only(['index', 'store'])

    router.resource('/paypal', PaypalController).apiOnly().only(['update', 'store'])

    router
      .group(() => {
        router.post('/', [FavouritesController, 'store'])
        router.delete('/:id', [FavouritesController, 'destroy'])
        router.post('/project/:id', [FavouritesController, 'destroyProjectFavourite'])
      })
      .prefix('/favourtie')

    router.resource('/favourite', FavouritesController).apiOnly().only(['store', 'destroy'])

    router
      .resource('/project', ProjectController)
      .apiOnly()
      .only(['update', 'store', 'destroy', 'index', 'show'])

    router
      .group(() => {
        router.put('/:id', [NotificationsController, 'update'])
        router.get('/', [NotificationsController, 'index'])
        router.get('/unread', [NotificationsController, 'getUnreadNotifications'])
      })
      .prefix('notification')

    router.get('coupon/:code', [CouponController])
  })
  .prefix('/api/user')
  .use([middleware.auth({ guards: ['api'] }), middleware.isClient()])
