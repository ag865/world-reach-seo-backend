/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import ImageController from '#controllers/ImageController'
import router from '@adonisjs/core/services/router'
import './Routes/AdminRoutes.js'
import './Routes/AuthRoutes.js'
import './Routes/ClientRoutes.js'

router.get('/api/image/:key', [ImageController, 'download'])
