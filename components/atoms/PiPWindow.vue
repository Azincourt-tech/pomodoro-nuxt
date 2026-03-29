<template>
  <!-- PiP Window -->
  <Teleport to="body">
    <div
      v-if="pipStore.isOpen"
      class="fixed bottom-4 right-4 z-[9999] w-72 bg-base-100 rounded-xl shadow-2xl border border-base-300 overflow-hidden transition-all duration-300"
      :class="pipStore.isMinimized ? 'h-14' : 'h-auto'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-3 py-2 bg-base-200 cursor-move">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs font-semibold">Pomodoro</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn btn-ghost btn-xs btn-circle" @click="pipStore.toggleMinimize" title="Minimizar">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <button class="btn btn-ghost btn-xs btn-circle" @click="pipStore.close" title="Fechar">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="!pipStore.isMinimized" class="p-4">
        <!-- Timer -->
        <div class="text-center mb-3">
          <div class="text-4xl font-bold font-rajdhani text-base-content">
            {{ countdown.minutes }}:{{ String(countdown.seconds).padStart(2, '0') }}
          </div>
          <div class="text-xs text-base-content/50 mt-1">
            {{ countdown.isActive ? 'Em andamento' : 'Pausado' }}
          </div>
        </div>

        <!-- Controls -->
        <div class="flex gap-2 justify-center mb-3">
          <button
            v-if="countdown.isActive"
            class="btn btn-error btn-sm"
            @click="stopTimer"
          >
            Parar
          </button>
          <button
            v-else
            class="btn btn-primary btn-sm"
            @click="startTimer"
          >
            Iniciar
          </button>
          <button
            class="btn btn-ghost btn-sm"
            @click="resetTimer"
          >
            Reset
          </button>
        </div>

        <!-- Current Challenge -->
        <div v-if="challenges.currentChallenge" class="bg-base-200 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <img :src="`/icons/${challenges.currentChallenge.type}.svg`" :alt="challenges.currentChallenge.type" class="w-5 h-5" />
            <span class="text-xs font-semibold">Desafio Atual</span>
          </div>
          <p class="text-xs text-base-content/70 leading-relaxed">
            {{ challenges.currentChallenge.description }}
          </p>
        </div>

        <!-- No challenge -->
        <div v-else class="text-center text-xs text-base-content/40 py-2">
          Inicie um ciclo para receber desafios
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCountdownStore } from '~/stores/countdown'
import { useChallengesStore } from '~/stores/challenges'
import { usePipStore } from '~/stores/pip'

const countdown = useCountdownStore()
const challenges = useChallengesStore()
const pipStore = usePipStore()

function startTimer() {
  countdown.setHasCompleted(false)
  countdown.setIsActive(true)
}

function stopTimer() {
  countdown.setIsActive(false)
}

function resetTimer() {
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  countdown.resetTime()
}
</script>
