import { defineStore } from 'pinia'

export interface UserProfile {
  name: string
  avatar: string
  githubUsername: string | null
}

export interface StreakData {
  streakCurrent: number
  streakBest: number
  lastSessionDate: string | null
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  avatar: '',
  githubUsername: null,
}

const DEFAULT_STREAK: StreakData = {
  streakCurrent: 0,
  streakBest: 0,
  lastSessionDate: null,
}

function getDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getYesterdayString(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return getDateString(yesterday)
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: { ...DEFAULT_PROFILE } as UserProfile,
    streak: { ...DEFAULT_STREAK } as StreakData,
    isEditing: false,
  }),

  getters: {
    displayName: state => state.profile.name,
    avatarUrl: (state) => {
      if (state.profile.githubUsername) {
        return `https://github.com/${state.profile.githubUsername}.png`
      }
      if (state.profile.avatar) {
        return state.profile.avatar
      }
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(state.profile.name)}&background=6366f1&color=fff&size=128`
    },
    streakCurrent: state => state.streak.streakCurrent,
    streakBest: state => state.streak.streakBest,
    lastSessionDate: state => state.streak.lastSessionDate,
  },

  actions: {
    updateProfile(data: Partial<UserProfile>) {
      this.profile = { ...this.profile, ...data }
      this.saveToStorage()
    },

    setGithubUser(username: string) {
      this.profile.githubUsername = username
      this.profile.avatar = ''
      this.saveToStorage()
    },

    clearGithubUser() {
      this.profile.githubUsername = null
      this.saveToStorage()
    },

    setEditing(flag: boolean) {
      this.isEditing = flag
    },

    updateStreak() {
      const today = getDateString()
      const yesterday = getYesterdayString()

      if (this.streak.lastSessionDate === today) {
        // Already completed today, streak unchanged
        return
      }

      if (this.streak.lastSessionDate === yesterday) {
        // Consecutive day, increment streak
        this.streak.streakCurrent += 1
      }
      else {
        // Streak broken or first session
        this.streak.streakCurrent = 1
      }

      this.streak.lastSessionDate = today

      if (this.streak.streakCurrent > this.streak.streakBest) {
        this.streak.streakBest = this.streak.streakCurrent
      }

      this.saveToStorage()
    },

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-profile')
        if (saved) {
          try {
            const data = JSON.parse(saved) as UserProfile
            this.profile = { ...DEFAULT_PROFILE, ...data }
          }
          catch {
            // ignore invalid data
          }
        }

        const streakSaved = localStorage.getItem('pomodoro-streak')
        if (streakSaved) {
          try {
            const data = JSON.parse(streakSaved) as StreakData
            this.streak = { ...DEFAULT_STREAK, ...data }
          }
          catch {
            // ignore invalid data
          }
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('pomodoro-profile', JSON.stringify(this.profile))
        localStorage.setItem('pomodoro-streak', JSON.stringify(this.streak))
      }
    },

    saveProgressToStorage(
      level: number,
      xp: { current: number, start: number, end: number },
      completedChallenges: number,
    ) {
      if (import.meta.client) {
        localStorage.setItem(
          'pomodoro-progress',
          JSON.stringify({ level, xp, completedChallenges }),
        )
      }
    },

    loadProgressFromStorage(): {
      level: number
      xp: { current: number, start: number, end: number }
      completedChallenges: number
    } | null {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-progress')
        if (saved) {
          try {
            return JSON.parse(saved)
          }
          catch {
            return null
          }
        }
      }
      return null
    },
  },
})
