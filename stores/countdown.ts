import { defineStore } from 'pinia'

const MINUTES = 25

export interface CountdownState {
  time: number
  isActive: boolean
  hasCompleted: boolean
}

export const useCountdownStore = defineStore('countdown', {
  state: (): CountdownState => ({
    time: MINUTES * 60,
    isActive: false,
    hasCompleted: false,
  }),

  getters: {
    minutes: (state) => Math.floor(state.time / 60),
    seconds: (state) => state.time % 60,
  },

  actions: {
    setTime(newTime: number) {
      this.time = newTime
    },
    resetTime() {
      this.time = MINUTES * 60
    },
    setIsActive(isActive: boolean) {
      this.isActive = isActive
    },
    setHasCompleted(hasCompleted: boolean) {
      this.hasCompleted = hasCompleted
    },
  },
})
