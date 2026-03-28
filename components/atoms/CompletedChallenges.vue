<template>
  <div class="stat bg-base-100 rounded-box shadow-sm p-3">
    <div class="stat-title text-xs">Desafios completados</div>
    <div class="stat-value text-primary text-2xl">{{ challenges.completedChallenges }}</div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
const challenges = useChallengesStore()
</script>
