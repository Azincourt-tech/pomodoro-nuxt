import { defineStore } from 'pinia'

export interface UserProfile {
  name: string
  avatar: string
  githubUsername: string | null
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  avatar: '',
  githubUsername: null,
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: { ...DEFAULT_PROFILE } as UserProfile,
    isEditing: false,
  }),

  getters: {
    displayName: (state) => state.profile.name,
    avatarUrl: (state) => {
      if (state.profile.githubUsername) {
        return `https://github.com/${state.profile.githubUsername}.png`
      }
      if (state.profile.avatar) {
        return state.profile.avatar
      }
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(state.profile.name)}&background=6366f1&color=fff&size=128`
    },
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

    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-profile')
        if (saved) {
          try {
            const data = JSON.parse(saved) as UserProfile
            this.profile = { ...DEFAULT_PROFILE, ...data }
          } catch {
            // ignore invalid data
          }
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('pomodoro-profile', JSON.stringify(this.profile))
      }
    },

    saveProgressToStorage(level: number, xp: { current: number; start: number; end: number }, completedChallenges: number) {
      if (import.meta.client) {
        localStorage.setItem('pomodoro-progress', JSON.stringify({ level, xp, completedChallenges }))
      }
    },

    loadProgressFromStorage(): { level: number; xp: { current: number; start: number; end: number }; completedChallenges: number } | null {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-progress')
        if (saved) {
          try {
            return JSON.parse(saved)
          } catch {
            return null
          }
        }
      }
      return null
    },
  },
})
