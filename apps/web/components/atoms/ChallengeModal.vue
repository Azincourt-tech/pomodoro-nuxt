<template>
  <div class="modal-backdrop" @click.self="onBackdropClick">
    <div class="modal-box">
      <header class="modal-box-header bg-primary text-primary-content">
        <h2 class="text-lg font-bold">
          {{ $t('challenges.modalTitle') }}
        </h2>
        <div class="modal-action">
          <button
            class="btn btn-ghost btn-square"
            aria-label="Close"
            @click="onCloseClick"
          >
            ×
          </button>
        </div>
      </header>

      <div class="modal-body py-6">
        <Challenge
          v-bind="challenge"
          @challenge-succeeded="onChallengeSucceeded"
          @challenge-failed="onChallengeFailed"
        />
      </div>

      <footer class="modal-box-footer">
        <button
          class="btn btn-ghost"
          @click="onCloseClick"
        >
          {{ $t('challenges.modalSkip') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Challenge from '~/components/molecules/Challenge.vue'
import { useChallengesStore } from '~/stores/challenges'

const props = defineProps<{
  challenge: {
    type: string
    description: string
    amount: number
  } | null
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'complete'): void
}>()

const challenges = useChallengesStore()

function onBackdropClick() {
  emits('close')
}

function onCloseClick() {
  emits('close')
}

function onChallengeSucceeded() {
  if (props.challenge) {
    challenges.completeChallenge(props.challenge.amount)
    challenges.saveToStorage()
    emits('complete')
  }
  emits('close')
}

function onChallengeFailed() {
  emits('close')
}
</script>