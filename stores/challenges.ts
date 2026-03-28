import { defineStore } from 'pinia'
import allChallenges from '~/assets/challenges/data'

export interface XP {
  current: number
  start: number
  end: number
}

export interface Challenge {
  type: string
  description: string
  amount: number
}

export const useChallengesStore = defineStore('challenges', {
  state: () => ({
    level: 1,
    xp: { current: 0, start: 0, end: 64 } as XP,
    completedChallenges: 0,
    currentChallengeIndex: null as number | null,
    isLevelUpModalOpen: false,
    allChallenges: allChallenges as Challenge[],
  }),

  getters: {
    challengesLength: (state) => state.allChallenges.length,
    currentXpPercentage: (state) => {
      if (state.xp.end === 0) return 0
      return Number(((state.xp.current / state.xp.end) * 100).toFixed(2))
    },
    currentChallenge: (state): Challenge | null =>
      typeof state.currentChallengeIndex === 'number'
        ? state.allChallenges[state.currentChallengeIndex]
        : null,
  },

  actions: {
    setCurrentChallengeIndex(index: number | null) {
      this.currentChallengeIndex = index
    },

    setIsLevelUpModalOpen(flag: boolean) {
      this.isLevelUpModalOpen = flag
    },

    completeChallenge(xpAmount: number) {
      const currentTotalXP = this.xp.current + xpAmount
      const shouldLevelUp = currentTotalXP >= this.xp.end
      this.completedChallenges += 1

      if (shouldLevelUp) {
        this.level += 1
        const remainingXp = currentTotalXP - this.xp.end
        const experienceToNextLevel = Math.pow((this.level + 1) * 4, 2)
        this.xp = { current: remainingXp, start: 0, end: experienceToNextLevel }
        this.isLevelUpModalOpen = true
        this.saveToStorage()
        return
      }
      this.xp = { ...this.xp, current: currentTotalXP }
      this.saveToStorage()
    },

    initFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('pomodoro-progress')
        if (saved) {
          try {
            const data = JSON.parse(saved) as { level: number; xp: XP; completedChallenges: number }
            this.level = data.level
            this.xp = data.xp
            this.completedChallenges = data.completedChallenges
          } catch {
            // ignore invalid data
          }
        }
      }
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem('pomodoro-progress', JSON.stringify({
          level: this.level,
          xp: this.xp,
          completedChallenges: this.completedChallenges,
        }))
      }
    },
  },
})
