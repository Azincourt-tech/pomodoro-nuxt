<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body items-center text-center p-6">
      <div class="badge badge-primary badge-lg gap-1 mb-2">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Win {{ amount }} xp
      </div>
      <div class="my-4">
        <img :src="`/icons/${type}.svg`" :alt="type" class="w-20 h-20" />
      </div>
      <h2 class="card-title">Work out</h2>
      <p class="text-base-content/70 text-sm leading-relaxed">{{ description }}</p>
      <div class="card-actions w-full mt-4 grid grid-cols-2 gap-2">
        <button class="btn btn-error btn-outline btn-sm h-10" @click="resetChallenges">Failed</button>
        <button class="btn btn-success btn-sm h-10" @click="challengeSucceeded">Completed</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'

const props = defineProps<{ type: string; description: string; amount: number }>()
const challenges = useChallengesStore()
const countdown = useCountdownStore()

function resetChallenges() {
  countdown.resetTime()
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  challenges.setCurrentChallengeIndex(null)
}

function challengeSucceeded() {
  resetChallenges()
  challenges.completeChallenge(props.amount)
  challenges.saveToStorage()
}
</script>
