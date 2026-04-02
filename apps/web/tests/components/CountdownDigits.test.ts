import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

describe('CountdownDigits Component', () => {
  const createWrapper = (digits: number) => {
    return mount(CountdownDigits, {
      props: { digits },
      global: {
        plugins: [createPinia()],
        stubs: {
          teleport: true,
        },
      },
    })
  }

  it('should render two digit spans', () => {
    const wrapper = createWrapper(25)

    const spans = wrapper.findAll('span')
    expect(spans.length).toBe(2)
  })

  it('should display minutes correctly', () => {
    const wrapper = createWrapper(25)

    const spans = wrapper.findAll('span')
    expect(spans[0].text()).toBe('2')
    expect(spans[1].text()).toBe('5')
  })

  it('should pad single digit numbers with zero', () => {
    const wrapper = createWrapper(5)

    const spans = wrapper.findAll('span')
    expect(spans[0].text()).toBe('0')
    expect(spans[1].text()).toBe('5')
  })

  it('should handle zero', () => {
    const wrapper = createWrapper(0)

    const spans = wrapper.findAll('span')
    expect(spans[0].text()).toBe('0')
    expect(spans[1].text()).toBe('0')
  })

  it('should have proper styling classes', () => {
    const wrapper = createWrapper(25)

    const span = wrapper.find('span')
    expect(span.classes()).toContain('bg-base-200')
    // Check for responsive rounded classes
    expect(span.classes()).toContain('rounded-xl')
    expect(span.classes()).toContain('font-rajdhani')
    expect(span.classes()).toContain('font-bold')
  })
})
