import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import Manga from '#models/manga'
import { createMangaValidator } from '#validators/manga'
import MangaService from '#services/manga_service'

export default class MangasController {
  async index(ctx: HttpContext) {
    const mangas = await Manga.all()
    const serializedMangas = mangas
      .map((manga) => ({
        ...manga.serialize(),
        signedPosterUrl: router.makeSignedUrl('signed.drive.view', [manga.location, manga.poster], {
          expiresIn: '5m',
        }),
      }))
      .sort((a: any, b: any) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      })

    return ctx.view.render('pages/mangas/index', { mangas: serializedMangas })
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
    const chapters = await MangaService.getAllChapters(manga.location)

    return view.render('pages/mangas/show', {
      chapters,
      manga: {
        ...manga.serialize(),
        signedBannerUrl: router.makeSignedUrl('signed.drive.view', [manga.location, manga.banner], {
          expiresIn: '5m',
        }),
        signedPosterUrl: router.makeSignedUrl('signed.drive.view', [manga.location, manga.poster], {
          expiresIn: '5m',
        }),
      },
    })
  }

  async edit({ params, view }: HttpContext) {
    const manga = await Manga.findOrFail(params.id)
    return view.render('pages/mangas/edit', { manga })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createMangaValidator)
    const manga = await Manga.findOrFail(params.id)
    await manga.merge(payload).save()
    session.flash('success', 'Manga updated successfully')
    return response.redirect().toRoute('mangas.show', [manga.id])
  }

  destroy() {}

  async chapter(ctx: HttpContext) {
    const { mangaId, chapterId } = ctx.params
    const manga = await Manga.findOrFail(mangaId)
    const images = await MangaService.getAllImagesFromChapter(manga.location, chapterId)
    const { next, previous } = await MangaService.getChapterLinks(manga.location, chapterId)

    return ctx.view.render('pages/mangas/chapter', {
      chapterId,
      images,
      manga,
      next,
      previous,
    })
  }
}
