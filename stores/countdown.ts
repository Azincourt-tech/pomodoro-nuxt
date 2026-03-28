import { defineStore } from 'pinia'

const DEFAULT_MINUTES = 25
const STORAGE_KEY = 'pomodoro-custom-minutes'

export const useCountdownStore = defineStore('countdown', {
  state: () => ({
    customMinutes: DEFAULT_MINUTES,
    time: DEFAULT_MINUTES * 60,
    isActive: false,
    hasCompleted: false,
  }),

  getters: {
    minutes: (state) => Math.floor(state.time / 60),
    seconds: (state) => state.time % 60,
  },

  actions: {
    setTime(newTime: number) { this.time = newTime },

    resetTime() { this.time = this.customMinutes * 60 },

    setIsActive(flag: boolean) { this.isActive = flag },

    setHasCompleted(flag: boolean) { this.hasCompleted = flag },

    setCustomMinutes(minutes: number) {
      this.customMinutes = minutes
      if (!this.isActive) {
        this.time = minutes * 60
      }
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, String(minutes))
      }
    },

    initFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const mins = parseInt(saved, 10)
          if (mins > 0 && mins <= 120) {
            this.customMinutes = mins
            this.time = mins * 60
          }
        }
      }
    },
  },
})
