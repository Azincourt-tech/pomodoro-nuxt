import { defineStore } from 'pinia'

export const usePipStore = defineStore('pip', {
  state: () => ({
    isOpen: false,
    isMinimized: false,
  }),

  actions: {
    open() {
      this.isOpen = true
      this.isMinimized = false
    },

    close() {
      this.isOpen = false
      this.isMinimized = false
    },

    toggleMinimize() {
      this.isMinimized = !this.isMinimized
    },

    toggle() {
      if (this.isOpen) {
        this.close()
      } else {
        this.open()
      }
    },
  },
})
