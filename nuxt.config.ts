// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-12-11',

  hub: {
    db: 'sqlite',
    kv: true,
    blob: true,
    cache: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
