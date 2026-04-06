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

describe('ExperienceBar Component', () => {
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

  it('should render the experience bar', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.h-6').exists()).toBe(true)
  })

  it('should display level', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('1')
  })

  it('should display XP values', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('64')
  })

  it('should display current XP percentage', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('0%')
  })

  it('should update when XP changes', async () => {
    const wrapper = createWrapper()
    const challenges = useChallengesStore()

    challenges.xp = { current: 32, start: 0, end: 64 }
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('32')
    expect(wrapper.text()).toContain('50%')
  })

  it('should have primary color styling', () => {
    const wrapper = createWrapper()
    // Check that the progress bar has bg-primary class
    const progressBar = wrapper.find('.h-full.rounded-full')
    expect(progressBar.classes()).toContain('bg-primary')
  })
})
