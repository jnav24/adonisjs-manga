import drive from '@adonisjs/drive/services/main'
import router from '@adonisjs/core/services/router'

export default class MangaService {
  public static async getAllChapters(location: string) {
    const disk = drive.use()
    const mangaDir = await disk.listAll(location)
    const chapters = []

    for (let item of mangaDir.objects) {
      if (item.isDirectory) {
        chapters.push(item)
      }
    }

    chapters.sort((a, b) => {
      return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' })
    })

    return chapters
  }

  public static async getAllImagesFromChapter(location: string, chapterId: string) {
    const disk = drive.use()
    const items = await disk.listAll(`${location}/${chapterId}`)
    const images = []

    for (let item of items.objects) {
      if (item.isFile) {
        const url = router.makeSignedUrl('signed.drive.view', [item.key], {
          expiresIn: '1m',
        })
        images.push({ url, name: item.name })
      }
    }

    return images
  }

  public static async getChapterLinks(location: string, chapterId: string) {
    const chapters = await this.getAllChapters(location)
    const chapterIndex = chapters.findIndex((chapter) => chapter.name === chapterId)
    return { next: chapters[chapterIndex - 1], previous: chapters[chapterIndex + 1] }
  }
}
