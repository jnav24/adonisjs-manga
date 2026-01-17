import { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import router from '@adonisjs/core/services/router'
import Manga from '#models/manga'
import { createMangaValidator } from '#validators/manga'

export default class MangasController {
  async index(ctx: HttpContext) {
    const mangas = await Manga.all()
    return ctx.view.render('pages/mangas/index', { mangas })
  }

  create({ view }: HttpContext) {
    return view.render('pages/mangas/create')
  }

  async store({ request, response, session }: HttpContext) {
    // const manga = request.only(['name', 'banner', 'description', 'location', 'thumbnail', 'poster'])
    const manga = await request.validateUsing(createMangaValidator)
    await Manga.create(manga)
    session.flash('success', 'Manga created successfully')
    return response.redirect().toRoute('mangas.index')
  }

  async show({ params, view }: HttpContext) {
    const manga = await Manga.findOrFail(params.id)
    const disk = drive.use()
    const mangaDir = await disk.listAll(manga.location)
    const chapters = []

    console.log('manga location: ', manga.location)
    console.log('manga directory: ', mangaDir)
    console.log('manga directory objects: ', mangaDir.objects)
    console.log('manga directory string objects: ', JSON.stringify(mangaDir.objects))
    for (let item of mangaDir.objects) {
      console.log('item: ', item)
      if (item.isDirectory) {
        chapters.push(item)
      }
    }

    return view.render('pages/mangas/show', {
      chapters,
      manga,
    })
  }

  edit({ view }: HttpContext) {
    return view.render('pages/mangas/edit')
  }

  update() {}

  destroy() {}

  async chapter(ctx: HttpContext) {
    const { mangaId, chapterId } = ctx.params
    const manga = await Manga.findOrFail(mangaId)
    const disk = drive.use()
    const items = await disk.listAll(`mangas/${manga.location}/${chapterId}`)
    const images = []

    for (let item of items.objects) {
      if (item.isFile) {
        const url = router.makeSignedUrl('signed.drive.view', [item.key], {
          expiresIn: '1m',
        })
        images.push({ url, name: item.name })
      }
    }

    return ctx.view.render('pages/mangas/chapter', { chapterId, images, manga })
  }
}
