<template>
  <dialog
    ref="modalRef"
    class="modal modal-bottom sm:modal-middle"
    :class="{ 'modal-open': isOpen }"
    @close="$emit('close')"
  >
    <div class="modal-box p-0 overflow-hidden border-2 border-primary/30 shadow-2xl animate-in zoom-in-95 fade-in-0 duration-300">
      <header class="bg-gradient-to-r from-primary to-secondary p-5 flex justify-between items-center text-primary-content shadow-lg">
        <h3 class="font-bold text-lg flex items-center gap-2">
          <Icon name="lucide:zap" class="w-6 h-6" />
          {{ $t('challenges.modalTitle', 'Novo Desafio!') }}
        </h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>
      </header>

      <div class="p-6">
        <Challenge
          v-if="challenge"
          v-bind="challenge"
          @challenge-succeeded="onChallengeSucceeded"
          @challenge-failed="onChallengeFailed"
        />
      </div>

      <div class="modal-action p-4 bg-base-200/50 mt-0">
        <button class="btn btn-ghost btn-block" @click="onSkipChallenge">
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

const props = defineProps<{
  challenge: any
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'complete'])
const modalRef = ref<HTMLDialogElement | null>(null)
const challenges = useChallengesStore()
const countdown = useCountdownStore()

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

function resetCycle() {
  countdown.resetTime()
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
}

function onChallengeSucceeded() {
  if (props.challenge) {
    resetCycle()
    challenges.setCurrentChallengeIndex(null)
    challenges.completeChallenge(props.challenge.amount)
    challenges.saveToStorage()
    emit('complete')
  }
  emit('close')
}

function onChallengeFailed() {
  // Não perde XP nem reseta level - apenas não ganha XP
  // O desafio continua disponível para tentar novamente
  resetCycle()
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