// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '~/assets/global.css'
  ],
  ssr: false, // Disable Server Side rendering
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true }
})