export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],
  devtools: { enabled: false },

  app: {
    head: {
      title: 'Pomodoro Move.it',
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pomodoro timer com challenges de saude e bem-estar' },
        { name: 'theme-color', content: '#6366f1' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/global.css'],

  compatibilityDate: '2024-11-01',

  i18n: {
    locales: [
      { code: 'pt-BR', name: 'Portugues', file: 'pt-BR.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'pt-BR',
    lazy: true,
    langDir: './',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: false,
      fallbackLocale: 'pt-BR',
    },
  },
})
