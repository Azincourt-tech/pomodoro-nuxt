import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCountdownStore } from '~/stores/countdown'

describe('Countdown Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useCountdownStore()

    expect(store.customMinutes).toBe(25)
    expect(store.time).toBe(25 * 60)
    expect(store.isActive).toBe(false)
    expect(store.hasCompleted).toBe(false)
  })

  it('should compute minutes getter correctly', () => {
    const store = useCountdownStore()
    store.time = 90 // 1 minute 30 seconds

    expect(store.minutes).toBe(1)
  })

  it('should compute seconds getter correctly', () => {
    const store = useCountdownStore()
    store.time = 90

    expect(store.seconds).toBe(30)
  })

  it('should set time correctly', () => {
    const store = useCountdownStore()
    store.setTime(100)

    expect(store.time).toBe(100)
  })

  it('should reset time to custom minutes', () => {
    const store = useCountdownStore()
    store.setCustomMinutes(15)
    store.time = 10

    store.resetTime()

    expect(store.time).toBe(15 * 60)
  })

  it('should set isActive flag', () => {
    const store = useCountdownStore()

    store.setIsActive(true)
    expect(store.isActive).toBe(true)

    store.setIsActive(false)
    expect(store.isActive).toBe(false)
  })

  it('should set hasCompleted flag', () => {
    const store = useCountdownStore()

    store.setHasCompleted(true)
    expect(store.hasCompleted).toBe(true)

    store.setHasCompleted(false)
    expect(store.hasCompleted).toBe(false)
  })

  it('should update custom minutes and time when not active', () => {
    const store = useCountdownStore()
    store.isActive = false

    store.setCustomMinutes(10)

    expect(store.customMinutes).toBe(10)
    expect(store.time).toBe(10 * 60)
  })

  it('should not update time when custom minutes changed while active', () => {
    const store = useCountdownStore()
    store.isActive = true
    store.time = 300 // 5 minutes remaining

    store.setCustomMinutes(10)

    expect(store.customMinutes).toBe(10)
    expect(store.time).toBe(300) // Should remain unchanged
  })

  it('should handle edge cases for minutes and seconds', () => {
    const store = useCountdownStore()

    // Zero time
    store.time = 0
    expect(store.minutes).toBe(0)
    expect(store.seconds).toBe(0)

    // Less than a minute
    store.time = 45
    expect(store.minutes).toBe(0)
    expect(store.seconds).toBe(45)

    // Exactly one minute
    store.time = 60
    expect(store.minutes).toBe(1)
    expect(store.seconds).toBe(0)
  })
})
