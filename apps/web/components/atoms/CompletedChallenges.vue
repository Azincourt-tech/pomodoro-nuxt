<template>
  <div class="stat bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 rounded-2xl shadow-xl border border-primary/25 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
    <div class="stat-figure">
      <div class="p-3.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
        <Icon name="lucide:trophy" class="w-6 h-6 text-primary" />
      </div>
    </div>
    <div class="stat-title text-xs font-medium text-base-content/60 uppercase tracking-wider">
      {{ $t('challenges.completedChallenges') }}
    </div>
    <div class="stat-value text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm">
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
