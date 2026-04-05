<template>
  <div class="stat bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl shadow-lg border border-primary/20 p-5 hover:shadow-xl transition-all duration-300 group">
    <div class="stat-figure">
      <div class="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
        <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
    </div>
    <div class="stat-title text-xs font-medium text-base-content/60 uppercase tracking-wide">
      {{ $t('challenges.completedChallenges') }}
    </div>
    <div class="stat-value text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {{ challenges.completedChallenges }}
    </div>
    <div class="stat-desc text-xs text-base-content/50 mt-1">
      {{ $t('challenges.totalCompleted', 'Total completado') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>
