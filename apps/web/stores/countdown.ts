import { defineStore } from 'pinia'

const DEFAULT_MINUTES = 25
const STORAGE_KEY = 'pomodoro-custom-minutes'
const BREAK_KEY = 'pomodoro-break-minutes'
const LONG_BREAK_KEY = 'pomodoro-long-break-minutes'
const CYCLES_KEY = 'pomodoro-long-break-cycles'

export const useCountdownStore = defineStore('countdown', {
  state: () => ({
    customMinutes: DEFAULT_MINUTES,
    time: DEFAULT_MINUTES * 60,
    isActive: false,
    hasCompleted: false,
    breakMinutes: 5,
    longBreakMinutes: 15,
    longBreakAfterCycles: 4,
    completedCycles: 0,
    isBreak: false,
    isLongBreak: false,
  }),

  getters: {
    minutes: state => Math.floor(state.time / 60),
    seconds: state => state.time % 60,
  },

  actions: {
    setTime(newTime: number) {
      this.time = newTime
    },

    resetTime() {
      this.time = this.customMinutes * 60
      this.isBreak = false
      this.isLongBreak = false
    },

    setIsActive(flag: boolean) {
      this.isActive = flag
    },

    setHasCompleted(flag: boolean) {
      this.hasCompleted = flag
    },

    setCustomMinutes(minutes: number) {
      this.customMinutes = minutes
      if (!this.isActive && !this.isBreak) {
        this.time = minutes * 60
      }
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, String(minutes))
      }
    },

    setBreakMinutes(minutes: number) {
      this.breakMinutes = minutes
      if (import.meta.client) {
        localStorage.setItem(BREAK_KEY, String(minutes))
      }
    },

    setLongBreakMinutes(minutes: number) {
      this.longBreakMinutes = minutes
      if (import.meta.client) {
        localStorage.setItem(LONG_BREAK_KEY, String(minutes))
      }
    },

    setLongBreakAfterCycles(cycles: number) {
      this.longBreakAfterCycles = cycles
      if (import.meta.client) {
        localStorage.setItem(CYCLES_KEY, String(cycles))
      }
    },

    incrementCompletedCycles() {
      this.completedCycles += 1
    },

    resetCompletedCycles() {
      this.completedCycles = 0
    },

    setBreakMode(isBreak: boolean, isLongBreak: boolean = false) {
      this.isBreak = isBreak
      this.isLongBreak = isLongBreak
      if (isBreak) {
        const breakTime = isLongBreak ? this.longBreakMinutes : this.breakMinutes
        this.time = breakTime * 60
      } else {
        this.time = this.customMinutes * 60
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

        const breakSaved = localStorage.getItem(BREAK_KEY)
        if (breakSaved) {
          const mins = parseInt(breakSaved, 10)
          if (mins > 0 && mins <= 30) {
            this.breakMinutes = mins
          }
        }

        const longBreakSaved = localStorage.getItem(LONG_BREAK_KEY)
        if (longBreakSaved) {
          const mins = parseInt(longBreakSaved, 10)
          if (mins > 0 && mins <= 60) {
            this.longBreakMinutes = mins
          }
        }

        const cyclesSaved = localStorage.getItem(CYCLES_KEY)
        if (cyclesSaved) {
          const cycles = parseInt(cyclesSaved, 10)
          if (cycles > 0 && cycles <= 10) {
            this.longBreakAfterCycles = cycles
          }
        }
      }
    },
  },
})
