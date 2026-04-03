<template>
  <dialog
    ref="modalRef"
    class="modal modal-bottom sm:modal-middle"
    @close="$emit('close')"
  >
    <div class="modal-box p-0 overflow-hidden border border-base-300 shadow-2xl">
      <header class="bg-primary p-4 flex justify-between items-center text-primary-content">
        <h3 class="font-bold text-lg flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
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
        <form method="dialog" class="w-full">
          <button class="btn btn-ghost btn-block" @click="$emit('close')">
            {{ $t('challenges.modalSkip', 'Fazer depois') }}
          </button>
        </form>
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

const props = defineProps<{
  challenge: any
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'complete'])
const modalRef = ref<HTMLDialogElement | null>(null)
const challenges = useChallengesStore()

watch(() => props.isOpen, (value) => {
  if (value) {
    modalRef.value?.showModal()
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
    challenges.completeChallenge(props.challenge.amount)
    challenges.saveToStorage()
    emit('complete')
  }
  emit('close')
}

function onChallengeFailed() {
  emit('close')
}
</script>