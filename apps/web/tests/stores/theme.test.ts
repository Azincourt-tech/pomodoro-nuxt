import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore, AVAILABLE_THEMES } from '~/stores/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with dark theme as default', () => {
    const store = useThemeStore()

    expect(store.currentTheme).toBe('dark')
  })

  it('should have all expected themes available', () => {
    expect(AVAILABLE_THEMES).toContain('light')
    expect(AVAILABLE_THEMES).toContain('dark')
    expect(AVAILABLE_THEMES).toContain('cupcake')
    expect(AVAILABLE_THEMES).toContain('dracula')
    expect(AVAILABLE_THEMES).toContain('synthwave')
    expect(AVAILABLE_THEMES).toContain('retro')
    expect(AVAILABLE_THEMES).toContain('cyberpunk')
    expect(AVAILABLE_THEMES).toContain('valentine')
    expect(AVAILABLE_THEMES).toContain('aqua')
    expect(AVAILABLE_THEMES).toContain('lofi')
    expect(AVAILABLE_THEMES.length).toBe(10)
  })

  it('should set theme', () => {
    const store = useThemeStore()

    store.setTheme('light')
    expect(store.currentTheme).toBe('light')

    store.setTheme('cupcake')
    expect(store.currentTheme).toBe('cupcake')
  })

  it('should include all required DaisyUI themes', () => {
    const requiredThemes = ['light', 'dark', 'dracula', 'synthwave']

    requiredThemes.forEach((theme) => {
      expect(AVAILABLE_THEMES).toContain(theme)
    })
  })

  it('should maintain theme type safety', () => {
    const store = useThemeStore()

    // TypeScript should enforce valid theme names
    const validTheme: (typeof AVAILABLE_THEMES)[number] = 'dark'
    store.setTheme(validTheme)

    expect(store.currentTheme).toBe(validTheme)
  })

  it('should set theme to all available themes', () => {
    const store = useThemeStore()

    AVAILABLE_THEMES.forEach((theme) => {
      store.setTheme(theme)
      expect(store.currentTheme).toBe(theme)
    })
  })
})
