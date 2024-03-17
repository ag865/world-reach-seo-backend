import AuthController from '#controllers/AuthController'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('login', [AuthController, 'clientLogin'])
    router.post('register', [AuthController, 'clientSignup'])
    router.post('reset-password', [AuthController, 'clientResetPassword'])
    router.put('update-password/:key', [AuthController, 'updatePassword'])
  })
  .prefix('/api/user/auth')

router
  .group(() => {
    router.post('login', [AuthController, 'adminLogin'])
    router.put('register/:key', [AuthController, 'adminReferralSignup'])
    router.put('update-password/:key', [AuthController, 'updatePassword'])
    router.post('reset-password', [AuthController, 'adminResetPassword'])
  })
  .prefix('/api/admin/auth')
