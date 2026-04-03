<template>
  <div class="bg-base-100 rounded-box shadow-sm flex flex-1 w-full">
    <StartCycle v-if="!challenges.currentChallenge" />
    <ChallengeModal
      v-if="isChallengeModalOpen"
      :challenge="challenges.currentChallenge"
      @close="isChallengeModalOpen = false"
      @complete="isChallengeModalOpen = false"
    />
    <LevelUpModal />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import LevelUpModal from '~/components/atoms/LevelUpModal.vue'
import StartCycle from '~/components/atoms/StartCycle.vue'
import ChallengeModal from '~/components/atoms/ChallengeModal.vue'

const challenges = useChallengesStore()
const isChallengeModalOpen = ref(false)

// Abre o modal sempre que um novo desafio é definido
watch(
  () => challenges.currentChallenge,
  (newChallenge) => {
    if (newChallenge !== null) {
      isChallengeModalOpen.value = true
    }
  },
  { immediate: true }
)
</script>