<template>
  <dialog
    ref="modalRef"
    class="modal modal-bottom sm:modal-middle"
    :class="{ 'modal-open': isOpen }"
    @close="$emit('close')"
  >
    <div class="modal-box p-0 overflow-hidden border-2 border-primary/30 shadow-2xl max-w-md relative">
      <!-- Decorative background with theme colors -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
      </div>

      <!-- Header with theme gradient -->
      <header class="relative z-10 bg-gradient-to-r from-primary to-secondary p-6 flex justify-between items-center shadow-xl">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon name="lucide:zap" class="w-6 h-6 drop-shadow-lg text-white" />
          </div>
          <h3 class="font-bold text-xl text-white">{{ $t('challenges.modalTitle', 'Novo Desafio!') }}</h3>
        </div>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 transition-all">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </form>
      </header>

      <!-- Challenge Component -->
      <div class="relative z-10 p-6">
        <Challenge
          v-if="challenge"
          v-bind="challenge"
          @challenge-succeeded="onChallengeSucceeded"
          @challenge-failed="onChallengeFailed"
        />
      </div>

      <!-- Footer Actions -->
      <div class="relative z-10 modal-action p-5 bg-gradient-to-r from-base-200/60 via-base-200/40 to-base-300/30 mt-0 border-t border-base-300/30">
        <button 
          class="btn btn-ghost btn-block gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300" 
          @click="onSkipChallenge"
        >
          <Icon name="lucide:skip-forward" class="w-5 h-5" />
          {{ $t('challenges.modalSkip', 'Pular Desafio') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Challenge from '~/components/molecules/Challenge.vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useToast } from '~/composables/useToast'
import { useSound } from '~/composables/useSound'

const props = defineProps<{
  challenge: any
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'complete'])
const modalRef = ref<HTMLDialogElement | null>(null)
const challenges = useChallengesStore()
const countdown = useCountdownStore()
const { success } = useToast()
const { playComplete } = useSound()

const { t } = useI18n()

watch(() => props.isOpen, (value) => {
  if (value) {
    modalRef.value?.showModal()
    // Vibração ao abrir a modal
    if (navigator.vibrate) {
      navigator.vibrate([50])
    }
  } else {
    modalRef.value?.close()
  }
})

onMounted(() => {
  if (props.isOpen) {
    modalRef.value?.showModal()
  }
})

function onChallengeSucceeded() {
  if (props.challenge) {
    // Increment completed cycles
    countdown.incrementCompletedCycles()
    
    // Check if long break
    const shouldLongBreak = countdown.completedCycles > 0 && countdown.completedCycles % countdown.longBreakAfterCycles === 0
    
    // Start break timer automatically
    countdown.setHasCompleted(true)
    countdown.setBreakMode(true, shouldLongBreak)
    countdown.setIsActive(true) // START the break timer!
    
    // Play completion sound
    playComplete()
    
    // Show success message
    if (shouldLongBreak) {
      success(t('challenges.longBreakStarted', 'Pausa longa iniciada: {min}min', { min: countdown.longBreakMinutes }))
    } else {
      success(t('challenges.shortBreakStarted', 'Pausa curta iniciada: {min}min', { min: countdown.breakMinutes }))
    }
    
    challenges.setCurrentChallengeIndex(null)
    challenges.saveToStorage()
    emit('complete')
  }
  emit('close')
}

function onChallengeFailed() {
  // Não perde XP nem reseta level - apenas não ganha XP
  // Não starta pausa se falhar
  emit('close')
}

function onSkipChallenge() {
  // Pula o desafio sem perder progresso - apenas muda para o próximo
  const currentIndex = challenges.currentChallengeIndex
  if (currentIndex !== null && currentIndex < challenges.challengesLength - 1) {
    challenges.setCurrentChallengeIndex(currentIndex + 1)
  } else {
    challenges.setCurrentChallengeIndex(0)
  }
  emit('close')
  // Vibração ao pular
  if (navigator.vibrate) {
    navigator.vibrate([30])
  }
}
</script>
