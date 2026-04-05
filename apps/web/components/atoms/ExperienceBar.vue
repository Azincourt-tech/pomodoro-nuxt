<template>
  <div class="mb-6">
    <!-- Level and XP Info -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="badge badge-primary badge-md font-bold shadow-md">
          <Icon name="lucide:star" class="w-3 h-3 mr-1" />
          </svg>
          {{ $t('nav.level', { level: challenges.level }) }}
        </div>
        
        <!-- Streak Badge -->
        <span
          v-if="profile.streakCurrent > 0"
          class="badge badge-error badge-md font-bold gap-1 shadow-md animate-pulse"
          :title="$t('streak.best', { days: profile.streakBest })"
        >
          {{ fireEmoji }} {{ profile.streakCurrent }}d
        </span>
      </div>
      
      <!-- XP Current -->
      <div class="text-right">
        <p class="text-xs font-medium text-base-content/60">{{ $t('experience.xp') }}</p>
        <p class="text-sm font-bold text-success">{{ challenges.xp.current }} / {{ challenges.xp.end }}</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="relative">
      <div class="h-4 bg-base-200 rounded-full overflow-hidden shadow-inner">
        <div
          class="h-full bg-gradient-to-r from-success via-success to-success/80 rounded-full transition-all duration-1000 ease-out relative"
          :style="{ width: `${challenges.currentXpPercentage}%` }"
        >
          <!-- Shimmer effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      
      <!-- Percentage Label -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="text-xs font-bold text-base-content drop-shadow-md">{{ challenges.currentXpPercentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useProfileStore } from '~/stores/profile'

const { t } = useI18n()
const challenges = useChallengesStore()
const profile = useProfileStore()

const fireEmoji = computed(() => {
  if (profile.streakCurrent >= 30) return '🔥🔥🔥'
  if (profile.streakCurrent >= 7) return '🔥🔥'
  return '🔥'
})
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
