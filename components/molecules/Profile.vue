<template>
  <div class="flex items-center">
    <img src="https://github.com/Azincourt-tech.png" alt="Azincourt-tech" class="mr-6 w-20 h-20 rounded-full">
    <div class="flex flex-col w-full">
      <strong class="text-title text-2xl">Willian Almeida</strong>
      <p class="flex items-center">
        <img src="/icons/level.svg" alt="level" class="mr-2">
        <span class="text-base">Level {{ challenges.level }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
const challenges = useChallengesStore()
</script>
