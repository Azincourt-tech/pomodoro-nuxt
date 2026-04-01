import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import { useChallengesStore } from '~/stores/challenges'

describe('ExperienceBar Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = () => {
    return mount(ExperienceBar, {
      global: {
        plugins: [createPinia()],
        stubs: {
          teleport: true,
        },
      },
    })
  }

  it('should render the experience bar', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.progress').exists()).toBe(true)
  })

  it('should display XP values', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('0 xp')
    expect(wrapper.text()).toContain('64 xp')
  })

  it('should display current XP percentage', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('0 xp (0%)')
  })

  it('should update when XP changes', async () => {
    const wrapper = createWrapper()
    const challenges = useChallengesStore()

    challenges.xp = { current: 32, start: 0, end: 64 }
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('32 xp (50%)')
  })

  it('should have success styling', () => {
    const wrapper = createWrapper()

    const progress = wrapper.find('.progress')
    expect(progress.classes()).toContain('progress-success')
  })

  it('should render start and end XP labels', () => {
    const wrapper = createWrapper()

    const spans = wrapper.findAll('span')
    const startSpan = spans.find(s => s.text().includes('0 xp'))
    const endSpan = spans.find(s => s.text().includes('64 xp'))

    expect(startSpan).toBeTruthy()
    expect(endSpan).toBeTruthy()
  })
})
