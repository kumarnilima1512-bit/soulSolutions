// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

   modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@vueuse/motion/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Soul Solutions | Heal · Understand · Grow',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'A safe, judgment-free space to talk, reflect and grow.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
  notionToken: '',
  notionDatabaseId: '',
  notionBlogDatabaseId: '',
  notionGalleryDatabaseId: '',
},
})
