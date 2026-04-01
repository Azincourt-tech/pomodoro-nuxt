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
  }),

  actions: {
    setTheme(theme: ThemeName) {
      this.currentTheme = theme
      if (import.meta.client) {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('pomodoro-theme', theme)
      }
    },
    initTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-theme') as ThemeName | null
        if (saved && (AVAILABLE_THEMES as readonly string[]).includes(saved)) {
          this.currentTheme = saved
        }
        document.documentElement.setAttribute('data-theme', this.currentTheme)
      }
    },
  },
})
