<template>
  <!-- Container principal - só exibir quando houver desafio ativo -->
  <div v-if="challenges.currentChallenge" class="bg-base-100 rounded-box shadow-sm flex flex-1 w-full min-h-[300px] animate-in fade-in zoom-in-95 duration-300">
    <!-- Estado: Desafio ativo (Mostra um resumo ou convite para abrir o modal) -->
    <div class="flex flex-col items-center justify-center w-full p-8 text-center">
      <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold mb-2">{{ $t('challenges.activeTitle', 'Desafio Ativo!') }}</h2>
      <p class="text-base-content/60 mb-6 max-w-xs">
        Você tem um desafio pendente. Complete-o para ganhar XP e subir de nível!
      </p>
      <button class="btn btn-primary gap-2" @click="isChallengeModalOpen = true">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Ver Desafio
      </button>
    </div>

    <ChallengeModal
      :challenge="challenges.currentChallenge"
      :is-open="isChallengeModalOpen"
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
import ChallengeModal from '~/components/atoms/ChallengeModal.vue'

const challenges = useChallengesStore()
const isChallengeModalOpen = ref(false)

// Abre o modal sempre que um novo desafio é definido (via timer ou atalho 'n')
watch(
  () => challenges.currentChallenge,
  (newChallenge) => {
    if (newChallenge !== null) {
      isChallengeModalOpen.value = true
    }
  }
)
</script>