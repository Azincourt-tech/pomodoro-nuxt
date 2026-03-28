<template>
  <div class="bg-base-100 rounded-box shadow-sm flex flex-1 w-full">
    <Challenge v-if="challenges.currentChallenge" v-bind="challenges.currentChallenge" />
    <StartCycle v-else />
    <LevelUpModal />
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
import LevelUpModal from '~/components/atoms/LevelUpModal.vue'
import StartCycle from '~/components/atoms/StartCycle.vue'
import Challenge from '~/components/molecules/Challenge.vue'

const challenges = useChallengesStore()
</script>
