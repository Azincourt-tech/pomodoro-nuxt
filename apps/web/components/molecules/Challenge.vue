<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body items-center text-center p-6">
      <div class="badge badge-primary badge-lg gap-1 mb-2">
        <svg
          class="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        {{ amount }} xp
      </div>

      <div class="my-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center"
          :class="typeBg"
        >
          <span v-html="typeSvg" />
        </div>
      </div>

      <h2 class="card-title text-lg">
        {{ typeLabel }}
      </h2>
      <p class="text-base-content/70 text-sm leading-relaxed">
        {{ description }}
      </p>

      <div class="card-actions w-full mt-4 grid grid-cols-2 gap-2">
        <button
          class="btn btn-error btn-outline btn-sm h-10"
          @click="resetChallenges"
        >
          {{ $t('challenges.failed') }}
        </button>
        <button
          class="btn btn-success btn-sm h-10"
          @click="challengeSucceeded"
        >
          {{ $t('challenges.completed') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'

const { t } = useI18n()
const props = defineProps<{ type: string, description: string, amount: number }>()
const emit = defineEmits<{
  (e: 'challenge-succeeded'): void
  (e: 'challenge-failed'): void
}>()
const challenges = useChallengesStore()
const countdown = useCountdownStore()

const typeLabel = computed(() => t(`challengeTypes.${props.type}`))

const typeBg = computed(() => {
  const map: Record<string, string> = {
    body: 'bg-green-500/20 text-green-600',
    eye: 'bg-blue-500/20 text-blue-600',
    drink: 'bg-cyan-500/20 text-cyan-600',
    breathe: 'bg-purple-500/20 text-purple-600',
    posture: 'bg-orange-500/20 text-orange-600',
    meditate: 'bg-indigo-500/20 text-indigo-600',
    walk: 'bg-emerald-500/20 text-emerald-600',
  }
  return map[props.type] || 'bg-gray-500/20 text-gray-600'
})

const typeSvg = computed(() => {
  const icons: Record<string, string> = {
    body: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
    eye: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
    drink:
      '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>',
    breathe:
      '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>',
    posture:
      '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
    meditate:
      '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
    walk: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>',
  }
  return icons[props.type] || icons.body
})

function resetChallenges() {
  emit('challenge-failed')
}

function challengeSucceeded() {
  emit('challenge-succeeded')
}
</script>
