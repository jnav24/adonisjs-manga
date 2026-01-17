import vine from '@vinejs/vine'

export const createMangaValidator = vine.compile(
  vine.object({
    banner: vine.string().trim(),
    description: vine.string().trim().escape(),
    name: vine.string().trim(),
    location: vine.string().trim(),
    poster: vine.string().trim(),
    thumbnail: vine.string().trim(),
  })
)
