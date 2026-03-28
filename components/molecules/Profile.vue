<template>
  <div class="flex items-center gap-4">
    <div class="avatar">
      <div class="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <img src="https://github.com/Azincourt-tech.png" alt="Willian Almeida" />
      </div>
    </div>
    <div class="flex flex-col">
      <strong class="text-xl font-bold text-base-content">Willian Almeida</strong>
      <div class="flex items-center gap-2 mt-1">
        <svg class="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="badge badge-warning badge-sm font-semibold">Level {{ challenges.level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
const challenges = useChallengesStore()
</script>
