<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body items-center text-center p-6">
      <div class="badge badge-primary badge-lg gap-1 mb-2">
        <Icon name="lucide:star" class="w-3 h-3" />>
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
    body: '<Icon name="lucide:activity" class="w-10 h-10" />></svg>',
    eye: '<Icon name="lucide:eye" class="w-10 h-10" />><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
    drink:
      '<Icon name="lucide:droplets" class="w-10 h-10" />></svg>',
    breathe:
      '<Icon name="lucide:wind" class="w-10 h-10" />></svg>',
    posture:
      '<Icon name="lucide:user" class="w-10 h-10" />></svg>',
    meditate:
      '<Icon name="lucide:sparkles" class="w-10 h-10" />></svg>',
    walk: '<Icon name="lucide:trending-up" class="w-10 h-10" />></svg>',
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
