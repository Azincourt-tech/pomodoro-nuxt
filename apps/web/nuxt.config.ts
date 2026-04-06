export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n', '@vite-pwa/nuxt'],
  devtools: { enabled: false },

  // Desabilitar SSR para evitar hydration mismatch
  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8787',
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID || '',
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Pomodoro Move.it',
      short_name: 'Pomodoro',
      description: 'Pomodoro timer com challenges de saude e bem-estar',
      theme_color: '#6366f1',
      background_color: '#1e1b4b',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,css,html,png,svg,mp3,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
    strategies: 'generateSW',
    srcDir: 'public',
    filename: 'sw-push.js',
  },

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
// full rebuild trigger
// force full rebuild Mon Apr  6 16:43:31 UTC 2026
// redeploy 1775499418
