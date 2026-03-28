import { defineStore } from 'pinia'

const MINUTES = 25

export const useCountdownStore = defineStore('countdown', {
  state: () => ({
    time: MINUTES * 60,
    isActive: false,
    hasCompleted: false,
  }),

  getters: {
    minutes: (state) => Math.floor(state.time / 60),
    seconds: (state) => state.time % 60,
  },

  actions: {
    setTime(newTime: number) { this.time = newTime },
    resetTime() { this.time = MINUTES * 60 },
    setIsActive(flag: boolean) { this.isActive = flag },
    setHasCompleted(flag: boolean) { this.hasCompleted = flag },
  },
})
