import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import { useChallengesStore } from '~/stores/challenges'
import { useProfileStore } from '~/stores/profile'

const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  messages: {
    'pt-BR': {
      experience: { xp: 'XP' },
      streak: { best: 'Melhor: {days} dias' },
    },
  },
})

describe('ExperienceBar Component - Theme Support', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = () => {
    return mount(ExperienceBar, {
      global: {
        plugins: [createPinia(), i18n],
        stubs: {
          teleport: true,
          Icon: { template: '<span class="icon" />' },
        },
      },
    })
  }

  it('should use bg-primary for progress bar (theme-aware)', () => {
    const wrapper = createWrapper()
    const progressBar = wrapper.find('.h-full.rounded-full')
    expect(progressBar.classes()).toContain('bg-primary')
  })

  it('should use badge-primary for level badge (theme-aware)', () => {
    const wrapper = createWrapper()
    const levelBadge = wrapper.find('.badge-primary')
    expect(levelBadge.exists()).toBe(true)
  })

  it('should use badge-error for streak badge when streak > 0 (theme-aware)', async () => {
    const wrapper = createWrapper()
    const profile = useProfileStore()
    profile.streakCurrent = 5
    await wrapper.vm.$nextTick()
    
    const streakBadge = wrapper.find('.badge-error')
    expect(streakBadge.exists()).toBe(true)
  })

  it('should use text-success for XP text (theme-aware)', () => {
    const wrapper = createWrapper()
    const xpText = wrapper.find('.text-success')
    expect(xpText.exists()).toBe(true)
  })

  it('should render shimmer animation element', () => {
    const wrapper = createWrapper()
    const shimmer = wrapper.find('.animate-shimmer')
    expect(shimmer.exists()).toBe(true)
  })

  it('should show XP to next level hint on hover', async () => {
    const wrapper = createWrapper()
    const hint = wrapper.find('.-bottom-5')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toContain('xp para o nível')
  })

  it('should calculate percentage correctly', async () => {
    const wrapper = createWrapper()
    const challenges = useChallengesStore()
    
    challenges.xp = { current: 16, start: 0, end: 64 }
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('25%')
  })

  it('should handle full XP bar (100%)', async () => {
    const wrapper = createWrapper()
    const challenges = useChallengesStore()
    
    challenges.xp = { current: 64, start: 0, end: 64 }
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('100%')
  })
})
