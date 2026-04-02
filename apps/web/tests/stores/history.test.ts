import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore, type SessionRecord } from '~/stores/history'

describe('History Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty sessions', () => {
    const store = useHistoryStore()
    expect(store.sessions).toEqual([])
    expect(store.totalSessions).toBe(0)
  })

  it('should add a session', () => {
    const store = useHistoryStore()
    const session: SessionRecord = {
      id: 'test-1',
      startedAt: Date.now(),
      duration: 25,
      challengeCompleted: 'Stretch your arms',
      xpGained: 80,
    }

    store.addSession(session)

    expect(store.sessions.length).toBe(1)
    expect(store.totalSessions).toBe(1)
    expect(store.totalTimeMinutes).toBe(25)
    expect(store.totalXpGained).toBe(80)
  })

  it('should calculate today sessions correctly', () => {
    const store = useHistoryStore()
    const now = Date.now()

    store.addSession({
      id: 'today-1',
      startedAt: now,
      duration: 25,
      challengeCompleted: null,
      xpGained: 50,
    })

    store.addSession({
      id: 'yesterday-1',
      startedAt: now - 86400000,
      duration: 30,
      challengeCompleted: null,
      xpGained: 60,
    })

    expect(store.todaySessions.length).toBe(1)
    expect(store.yesterdaySessions.length).toBe(1)
  })

  it('should group sessions by day', () => {
    const store = useHistoryStore()
    const now = Date.now()

    store.addSession({
      id: 's1',
      startedAt: now,
      duration: 25,
      challengeCompleted: null,
      xpGained: 50,
    })

    store.addSession({
      id: 's2',
      startedAt: now - 3600000,
      duration: 25,
      challengeCompleted: null,
      xpGained: 50,
    })

    const grouped = store.groupedByDay
    const keys = Object.keys(grouped)
    expect(keys.length).toBe(1)
    expect(grouped[keys[0]].length).toBe(2)
  })

  it('should calculate average daily sessions', () => {
    const store = useHistoryStore()

    store.addSession({ id: '1', startedAt: Date.now(), duration: 25, challengeCompleted: null, xpGained: 50 })
    store.addSession({ id: '2', startedAt: Date.now(), duration: 25, challengeCompleted: null, xpGained: 50 })

    expect(store.avgDailySessions).toBe(2)
  })

  it('should sort day keys in descending order', () => {
    const store = useHistoryStore()
    const now = Date.now()

    store.addSession({ id: '1', startedAt: now, duration: 25, challengeCompleted: null, xpGained: 50 })
    store.addSession({ id: '2', startedAt: now - 86400000, duration: 25, challengeCompleted: null, xpGained: 50 })

    const keys = store.sortedDayKeys
    expect(keys.length).toBe(2)
    expect(keys[0] > keys[1]).toBe(true)
  })

  it('should clear all sessions', () => {
    const store = useHistoryStore()
    store.addSession({ id: '1', startedAt: Date.now(), duration: 25, challengeCompleted: null, xpGained: 50 })
    store.clearAll()
    expect(store.sessions.length).toBe(0)
  })
})
