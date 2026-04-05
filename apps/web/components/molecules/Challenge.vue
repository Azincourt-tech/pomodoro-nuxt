<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body items-center text-center p-6">
      <div class="badge badge-primary badge-lg gap-1 mb-2">
        <Icon name="lucide:star" class="w-3 h-3" />
        {{ amount }} xp
      </div>

      <div class="my-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center"
          :class="typeBg"
        >
          <Icon :name="typeIcon" class="w-10 h-10" />
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

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    body: 'lucide:activity',
    eye: 'lucide:eye',
    drink: 'lucide:droplets',
    breathe: 'lucide:wind',
    posture: 'lucide:user-check',
    meditate: 'lucide:sparkles',
    walk: 'lucide:trending-up',
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
