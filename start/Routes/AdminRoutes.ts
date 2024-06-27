import CategoriesController from '#controllers/AdminControllers/CategoriesController'
import CouponsController from '#controllers/AdminControllers/CouponsController'
import DashboardController from '#controllers/AdminControllers/DashboardController'
import MemberController from '#controllers/AdminControllers/MemberController'
import OrdersController from '#controllers/AdminControllers/OrdersController'
import PaymentApiSettingsController from '#controllers/AdminControllers/PaymentAPISettingController'
import SalesRepresentativesController from '#controllers/AdminControllers/SalesRepresentativesController'
import UserController from '#controllers/AdminControllers/UserController'
import NotificationsController from '#controllers/AdminControllers/Website/NotificationsController'
import WebsitesController from '#controllers/AdminControllers/Website/WebsiteController'
import WebsiteExportController from '#controllers/AdminControllers/Website/WebsiteExportController'
import WebsiteMultipleDeleteController from '#controllers/AdminControllers/Website/WebsiteMultipleDeleteController'
import WebsiteMultipleUploadsController from '#controllers/AdminControllers/Website/WebsiteMultipleUploadController'
import AuthController from '#controllers/AuthController'
import ProfileController from '#controllers/ProfileController'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('auth/logout', [AuthController, 'logout'])

    router.put('profile/reset-password', [UserController, 'resetPassword'])

    router.resource('member', MemberController).apiOnly()

    router
      .group(() => {
        router.put('activate/:id', [UserController, 'activate'])
        router.put('de-activate/:id', [UserController, 'deActivate'])
        router.put('/:id', [UserController, 'update'])
        router.get('/', [UserController, 'get'])
        router.get('/:id', [UserController, 'getUser'])
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

    router.resource('profile', ProfileController).apiOnly().only(['index', 'store'])

    router
      .resource('website', WebsitesController)
      .apiOnly()
      .only(['index', 'store', 'update', 'destroy'])

    router.post('/website/import', [WebsiteMultipleUploadsController])

    router.post('/website/delete-multiple', [WebsiteMultipleDeleteController])

    router.get('/website/export', [WebsiteExportController])

    router.resource('/admin-order', OrdersController).apiOnly().except(['destroy'])

    router.get('/dashboard', [DashboardController])

    router
      .group(() => {
        router.put('/:id', [NotificationsController, 'update'])
        router.get('/', [NotificationsController, 'index'])
        router.get('/unread', [NotificationsController, 'getUnreadNotifications'])
      })
      .prefix('notification')

    router
      .resource('coupons', CouponsController)
      .apiOnly()
      .only(['destroy', 'index', 'store', 'update'])
  })
  .prefix('/api/admin')
  .use([middleware.auth({ guards: ['api'] }), middleware.isAdmin()])
