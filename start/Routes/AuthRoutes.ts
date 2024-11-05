import AuthController from '#controllers/AuthController'
import RegistrationsController from '#controllers/RegistrationsController'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('login', [AuthController, 'clientLogin'])

    router
      .group(() => {
        router.post('email', [RegistrationsController, 'emailRegistration'])
        router.post('password/:id', [RegistrationsController, 'savePassword'])
        router.post('personal-info/:id', [RegistrationsController, 'savePersonalInfo'])
        router.post('industry/:id', [RegistrationsController, 'saveIndustryInfo'])
        router.post('send-confirmation-email/:id', [
          RegistrationsController,
          'sendConfirmationEmail',
        ])

        router.post('appointment/:id', [RegistrationsController, 'saveAppointment'])
      })
      .prefix('register')

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
