// quasar.config.js
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file
import { defineConfig } from '#q-app/wrappers'
import { config as loadEnv } from 'dotenv'

loadEnv(); // carrega .env*. Define process.env.*

export default defineConfig(() => {
  return {
    boot: ['axios', 'head'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons', 'mdi-v5'],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      vueRouterMode: 'history',
      // Quasar injeta isso no bundle (como constantes)
      env: {
        BACKEND_URL: process.env.BACKEND_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        APP_BASE_URL: process.env.APP_BASE_URL,
        PROD_SLUGS_API: process.env.PROD_SLUGS_API
      }
    },
    devServer: { open: true },
    framework: {
      config: {},
      plugins: ['Notify', 'Dialog']
    },
    animations: [],
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false
    },
    pwa: { workboxMode: 'GenerateSW' },
    capacitor: { hideSplashscreen: true },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      builder: { appId: 'app' }
    },
    bex: { extraScripts: [] }
  }
})
