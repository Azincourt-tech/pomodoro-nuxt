import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChallengesStore } from '~/stores/challenges'

describe('Challenges Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useChallengesStore()

    expect(store.level).toBe(1)
    expect(store.xp.current).toBe(0)
    expect(store.xp.start).toBe(0)
    expect(store.xp.end).toBe(64)
    expect(store.completedChallenges).toBe(0)
    expect(store.currentChallengeIndex).toBe(null)
    expect(store.isLevelUpModalOpen).toBe(false)
  })

  it('should have challenges loaded', () => {
    const store = useChallengesStore()

    expect(store.allChallenges.length).toBeGreaterThan(0)
    expect(store.challengesLength).toBeGreaterThan(0)
  })

  it('should calculate currentXpPercentage correctly', () => {
    const store = useChallengesStore()
    store.xp = { current: 32, start: 0, end: 64 }

    expect(store.currentXpPercentage).toBe(50)
  })

  it('should return 0 for currentXpPercentage when end is 0', () => {
    const store = useChallengesStore()
    store.xp = { current: 0, start: 0, end: 0 }

    expect(store.currentXpPercentage).toBe(0)
  })

  it('should set current challenge index', () => {
    const store = useChallengesStore()

    store.setCurrentChallengeIndex(5)
    expect(store.currentChallengeIndex).toBe(5)

    store.setCurrentChallengeIndex(null)
    expect(store.currentChallengeIndex).toBe(null)
  })

  it('should return current challenge from getter', () => {
    const store = useChallengesStore()
    store.setCurrentChallengeIndex(0)

    const challenge = store.currentChallenge
    expect(challenge).not.toBe(null)
    expect(challenge?.description).toBeDefined()
  })

  it('should return null when no challenge selected', () => {
    const store = useChallengesStore()

    expect(store.currentChallenge).toBe(null)
  })

  it('should set level up modal open state', () => {
    const store = useChallengesStore()

    store.setIsLevelUpModalOpen(true)
    expect(store.isLevelUpModalOpen).toBe(true)

    store.setIsLevelUpModalOpen(false)
    expect(store.isLevelUpModalOpen).toBe(false)
  })

  it('should complete challenge without level up', () => {
    const store = useChallengesStore()
    store.xp = { current: 10, start: 0, end: 100 }

    store.completeChallenge(20)

    expect(store.completedChallenges).toBe(1)
    expect(store.xp.current).toBe(30)
    expect(store.level).toBe(1)
    expect(store.isLevelUpModalOpen).toBe(false)
  })

  it('should complete challenge with level up', () => {
    const store = useChallengesStore()
    store.level = 1
    store.xp = { current: 50, start: 0, end: 64 }

    store.completeChallenge(20) // 50 + 20 = 70 >= 64, should level up

    expect(store.level).toBe(2)
    expect(store.completedChallenges).toBe(1)
    expect(store.isLevelUpModalOpen).toBe(true)
    // Remaining XP after level up: 70 - 64 = 6
    expect(store.xp.current).toBe(6)
    // New end should be based on level formula: ((2+1)*4)^2 = 144
    expect(store.xp.end).toBe(144)
  })

  it('should handle multiple level ups in single challenge', () => {
    const store = useChallengesStore()
    store.level = 1
    store.xp = { current: 0, start: 0, end: 64 }

    // Complete with massive XP
    store.completeChallenge(200)

    expect(store.level).toBe(2)
    expect(store.completedChallenges).toBe(1)
  })

  it('should handle completeChallenge edge cases', () => {
    const store = useChallengesStore()
    store.xp = { current: 0, start: 0, end: 100 }

    // Complete with 0 XP
    store.completeChallenge(0)
    expect(store.completedChallenges).toBe(1)
    expect(store.xp.current).toBe(0)
  })
})
