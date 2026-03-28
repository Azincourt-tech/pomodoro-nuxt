<template>
  <transition name="slide-fade">
    <div
      v-if="challenges.isLevelUpModalOpen"
      class="overlay flex justify-center items-center bg-gray-line fixed inset-0"
      @click="challenges.setIsLevelUpModalOpen(false)"
    >
      <div class="bg-white w-full max-w-md p-10 rounded-md shadow-lg text-center relative" @click.stop>
        <header class="text-9xl font-semibold text-blue bg-contain">
          {{ challenges.level }}
        </header>

        <strong class="text-2xl text-text mt-1">
          Congratulations!
        </strong>

        <p>
          You reached a new level!
        </p>

        <button
          type="button"
          class="absolute right-2 top-2 bg-transparent border-0"
          @click="challenges.setIsLevelUpModalOpen(false)"
        >
          <img src="/icons/close.svg" alt="Close modal">
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
const challenges = useChallengesStore()
</script>

<style scoped>
.overlay {
  background-color: rgba(242, 243, 245, 0.8);
}
header {
  background: url('/icons/levelup.svg') no-repeat center;
}
button {
  font-size: 0;
}
</style>
