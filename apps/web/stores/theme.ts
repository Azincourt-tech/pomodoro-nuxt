import { defineStore } from 'pinia'

export const AVAILABLE_THEMES = [
  'light',
  'dark',
  'cupcake',
  'dracula',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'aqua',
  'lofi',
] as const

export type ThemeName = (typeof AVAILABLE_THEMES)[number]

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'dark' as ThemeName,
    autoDarkMode: false,
  }),

  actions: {
    setTheme(theme: ThemeName) {
      this.currentTheme = theme
      this.autoDarkMode = false
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('pomodoro-theme', theme)
        localStorage.removeItem('pomodoro-auto-dark')
      }
    },
    initTheme() {
      if (import.meta.client) {
        const autoDark = localStorage.getItem('pomodoro-auto-dark')
        if (autoDark === 'true') {
          this.autoDarkMode = true
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          this.currentTheme = prefersDark ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', this.currentTheme)

          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.autoDarkMode) {
              this.currentTheme = e.matches ? 'dark' : 'light'
              document.documentElement.setAttribute('data-theme', this.currentTheme)
            }
          })
          return
        }

        const saved = localStorage.getItem('pomodoro-theme') as ThemeName | null
        if (saved && (AVAILABLE_THEMES as readonly string[]).includes(saved)) {
          this.currentTheme = saved
        }
        document.documentElement.setAttribute('data-theme', this.currentTheme)
      }
    },
    toggleAutoDarkMode() {
      this.autoDarkMode = !this.autoDarkMode
      if (import.meta.client) {
        localStorage.setItem('pomodoro-auto-dark', String(this.autoDarkMode))
        if (this.autoDarkMode) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          this.currentTheme = prefersDark ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', this.currentTheme)
        }
      }
    },
  },
})
