<template>
  <div class="mb-4">
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-base-content/60">{{ challenges.xp.start }} xp</span>
      <progress
        class="progress progress-success flex-1 h-3"
        :value="challenges.currentXpPercentage"
        max="100"
      />
      <span class="text-sm font-medium text-base-content/60">{{ challenges.xp.end }} xp</span>
    </div>
    <div class="text-center mt-1">
      <span class="badge badge-success badge-sm font-medium">
        {{ challenges.xp.current }} xp ({{ challenges.currentXpPercentage }}%)
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>
