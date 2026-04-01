<template>
  <div class="stat bg-base-100 rounded-box shadow-sm p-4">
    <div class="stat-title">
      {{ $t('challenges.completedChallenges') }}
    </div>
    <div class="stat-value text-primary text-3xl">
      {{ challenges.completedChallenges }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>
