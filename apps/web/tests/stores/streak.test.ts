import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '~/stores/profile'

describe('Profile Store - Streak', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize streak at 0', () => {
    const store = useProfileStore()
    expect(store.streakCurrent).toBe(0)
    expect(store.streakBest).toBe(0)
    expect(store.lastSessionDate).toBe(null)
  })

  it('should set streak to 1 on first session', () => {
    const store = useProfileStore()
    store.updateStreak()
    expect(store.streakCurrent).toBe(1)
    expect(store.streakBest).toBe(1)
  })

  it('should not increment streak if already completed today', () => {
    const store = useProfileStore()
    store.updateStreak()
    store.updateStreak()
    expect(store.streakCurrent).toBe(1)
  })

  it('should increment streak for consecutive days', () => {
    const store = useProfileStore()

    // Simulate yesterday session
    store.streak.streakCurrent = 1
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    store.streak.lastSessionDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    // Today's session
    store.updateStreak()
    expect(store.streakCurrent).toBe(2)
  })

  it('should reset streak after gap', () => {
    const store = useProfileStore()

    // Simulate a session 3 days ago with best streak of 5
    store.streak.streakCurrent = 3
    store.streak.streakBest = 5
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    store.streak.lastSessionDate = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(threeDaysAgo.getDate()).padStart(2, '0')}`

    // Today's session - streak should reset to 1
    store.updateStreak()
    expect(store.streakCurrent).toBe(1)
    expect(store.streakBest).toBe(5) // Best should be preserved
  })

  it('should track best streak correctly', () => {
    const store = useProfileStore()

    // First session
    store.updateStreak()
    expect(store.streakBest).toBe(1)

    // Simulate getting to streak of 5
    store.streak.streakCurrent = 5
    store.streak.streakBest = 5

    // Reset after gap
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 10)
    store.streak.lastSessionDate = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}-${String(oldDate.getDate()).padStart(2, '0')}`
    store.updateStreak()

    expect(store.streakCurrent).toBe(1)
    expect(store.streakBest).toBe(5) // Best preserved
  })

  it('should return computed streak values', () => {
    const store = useProfileStore()
    store.streak.streakCurrent = 3
    store.streak.streakBest = 7

    expect(store.streakCurrent).toBe(3)
    expect(store.streakBest).toBe(7)
  })
})
