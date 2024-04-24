import AuthController from '#controllers/AuthController'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('login', [AuthController, 'clientLogin'])

    router.post('register', [AuthController, 'clientSignup'])

    router.post('reset-password', [AuthController, 'clientResetPassword'])

    router.put('verify/:id', [AuthController, 'verifyAccount'])

    router.put('update-password/:key', [AuthController, 'updatePassword'])
  })
  .prefix('/api/user/auth')

router
  .group(() => {
    router.post('login', [AuthController, 'adminLogin'])

    router.put('update-password/:key', [AuthController, 'updatePassword'])

    router.post('reset-password', [AuthController, 'adminResetPassword'])

    router.get('get-user-details-by-referral-key/:key', [
      AuthController,
      'getUserDetailsByReferralKey',
    ])
  })
  .prefix('/api/admin/auth')
