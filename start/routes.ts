/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import drive from '@adonisjs/drive/services/main'

const MangasController = () => import('#controllers/mangas_controller')

router.on('/').render('pages/home')

router.resource('mangas', MangasController)
router
  .get('mangas/:mangaId/chapters/:chapterId', [MangasController, 'chapter'])
  .as('mangas.chapter')

router
  .get('/storage/mangas/*', async ({ request, response }) => {
    if (!request.hasValidSignature()) {
      return response.forbidden('Invalid or expired signature')
    }

    const filePath = request.param('*').join('/')

    try {
      const stream = await drive.use('fs').getStream(filePath)
      return response.stream(stream)
    } catch (error) {
      return response.notFound('File not found')
    }
  })
  .as('signed.drive.view')
