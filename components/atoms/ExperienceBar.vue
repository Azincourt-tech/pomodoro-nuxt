<template>
  <header class="pb-10 flex items-center">
    <p class="text-sm">
      {{ `${challenges.xp.start} xp` }}
    </p>
    <div class="mx-4 lg:mx-6 flex-1 bg-gray-line h-1 rounded-md">
      <div class="relative bg-green h-1" :style="{ width: `${challenges.currentXpPercentage}%` }">
        <p class="text-sm absolute -right-4 w-max top-2">
          {{ `${challenges.xp.current} xp (${challenges.currentXpPercentage}%)` }}
        </p>
      </div>
    </div>
    <p class="text-sm">
      {{ `${challenges.xp.end} xp` }}
    </p>
  </header>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
const challenges = useChallengesStore()
</script>
