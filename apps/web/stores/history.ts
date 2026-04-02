import { defineStore } from 'pinia'

export interface SessionRecord {
  id: string
  startedAt: number
  duration: number
  challengeCompleted: string | null
  xpGained: number
}

const STORAGE_KEY = 'pomodoro-sessions'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    sessions: [] as SessionRecord[],
  }),

  getters: {
    totalSessions: state => state.sessions.length,

    totalTimeMinutes: state =>
      state.sessions.reduce((total, s) => total + s.duration, 0),

    totalXpGained: state =>
      state.sessions.reduce((total, s) => total + s.xpGained, 0),

    todaySessions: (state): SessionRecord[] => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayMs = today.getTime()
      const tomorrowMs = todayMs + 86400000
      return state.sessions.filter(s => s.startedAt >= todayMs && s.startedAt < tomorrowMs)
    },

    yesterdaySessions: (state): SessionRecord[] => {
      const yesterday = new Date()
      yesterday.setHours(0, 0, 0, 0)
      const yesterdayMs = yesterday.getTime() - 86400000
      const todayMs = yesterdayMs + 86400000
      return state.sessions.filter(s => s.startedAt >= yesterdayMs && s.startedAt < todayMs)
    },

    weekSessions: (state): SessionRecord[] => {
      const weekAgo = Date.now() - 7 * 86400000
      return state.sessions.filter(s => s.startedAt >= weekAgo)
    },

    groupedByDay: (state): Record<string, SessionRecord[]> => {
      const groups: Record<string, SessionRecord[]> = {}
      for (const session of state.sessions) {
        const date = new Date(session.startedAt)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(session)
      }
      return groups
    },

    sortedDayKeys: (state): string[] => {
      const groups: Record<string, SessionRecord[]> = {}
      for (const session of state.sessions) {
        const date = new Date(session.startedAt)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(session)
      }
      return Object.keys(groups).sort((a, b) => b.localeCompare(a))
    },

    avgDailySessions(): number {
      if (this.totalSessions === 0) return 0
      const days = new Set(
        this.sessions.map(s => {
          const d = new Date(s.startedAt)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        }),
      ).size
      return Math.round((this.totalSessions / days) * 10) / 10
    },

    avgDailyMinutes(): number {
      if (this.totalSessions === 0) return 0
      const days = new Set(
        this.sessions.map(s => {
          const d = new Date(s.startedAt)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        }),
      ).size
      return Math.round(this.totalTimeMinutes / days)
    },
  },

  actions: {
    addSession(session: SessionRecord) {
      this.sessions.unshift(session)
      this.saveToStorage()
    },

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const data = JSON.parse(saved) as SessionRecord[]
            this.sessions = data
          }
          catch {
            // ignore invalid data
          }
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions))
      }
    },

    clearAll() {
      this.sessions = []
      this.saveToStorage()
    },
  },
})
