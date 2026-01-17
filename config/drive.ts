import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

export default defineConfig({
  default: env.get('DRIVE_DISK', 'fs') as 'fs',

  services: {
    fs: services.fs({
      location: app.inProduction ? app.makePath('..', 'storage') : app.makePath('storage'),
      visibility: 'private',
      // appUrl: 'http://localhost:3000',
      serveFiles: false,
      // routeBasePath: '/storage',
    }),
  },
})
