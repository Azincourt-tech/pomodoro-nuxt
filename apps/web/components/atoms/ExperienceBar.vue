<template>
  <div class="mb-6 relative">
    <!-- Background glow effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-success/5 to-secondary/5 rounded-2xl blur-xl -z-10" />
    
    <!-- Level and XP Info - Enhanced -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2.5">
        <!-- Level Badge -->
        <div class="relative group">
          <div class="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
          <div class="badge badge-primary badge-lg font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
            <Icon name="lucide:trophy" class="w-4 h-4 mr-1.5" />
            {{ challenges.level }}
          </div>
        </div>
        
        <!-- Streak Badge -->
        <div
          v-if="profile.streakCurrent > 0"
          class="relative group cursor-help"
          :title="$t('streak.best', { days: profile.streakBest })"
        >
          <div class="absolute inset-0 bg-error/20 rounded-xl blur-md animate-pulse" />
          <div class="badge badge-error badge-lg font-black gap-1.5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
            <Icon name="lucide:flame" class="w-4 h-4 animate-bounce" />
            {{ profile.streakCurrent }}d
          </div>
        </div>
      </div>
      
      <!-- XP Current - Enhanced -->
      <div class="text-right">
        <div class="flex items-center justify-end gap-1.5 mb-0.5">
          <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-success animate-pulse" />
          <p class="text-xs font-bold text-base-content/70">{{ $t('experience.xp') }}</p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <p class="text-lg font-black text-success">
            {{ challenges.xp.current }}
          </p>
          <span class="text-xs text-base-content/40 font-medium">/</span>
          <p class="text-sm font-bold text-base-content/60">{{ challenges.xp.end }}</p>
        </div>
      </div>
    </div>

    <!-- Progress Bar - Modernized -->
    <div class="relative group">
      <!-- Outer glow -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 via-success/20 to-secondary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <!-- Bar container -->
      <div class="h-6 bg-gradient-to-r from-base-200/60 via-base-200/80 to-base-300/60 rounded-full overflow-hidden shadow-inner border border-base-300/30 backdrop-blur-sm">
        <!-- Progress fill with theme colors -->
        <div
          class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden bg-primary"
          :style="{ width: `${Math.max(challenges.currentXpPercentage, 2)}%` }"
        >
          <!-- Shimmer effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          
          <!-- Top highlight -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
      
      <!-- Percentage Label - Transparente -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ challenges.currentXpPercentage }}%
        </span>
      </div>
      
      <!-- XP to next level hint -->
      <div 
        v-if="challenges.xp.end - challenges.xp.current > 0"
        class="absolute -bottom-5 right-0 text-xs text-base-content/40 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Icon name="lucide:arrow-up" class="w-3 h-3" />
        {{ challenges.xp.end - challenges.xp.current }}xp para o nível {{ challenges.level + 1 }}
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
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2.5s infinite;
}
</style>
