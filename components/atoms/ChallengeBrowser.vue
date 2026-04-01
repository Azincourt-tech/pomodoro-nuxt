<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex items-center gap-2 mb-4">
        <svg
          class="w-5 h-5 text-warning"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          />
        </svg>
        <h3 class="font-semibold text-sm">
          {{ $t('challenges.allChallenges') }}
        </h3>
        <span class="badge badge-sm badge-ghost ml-auto">{{
          $t('challenges.available', { count: challenges.allChallenges.length })
        }}</span>
      </div>

      <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
        <div
          v-for="(challenge, index) in groupedChallenges"
          :key="index"
          class="collapse collapse-arrow bg-base-200 rounded-lg"
        >
          <input
            type="checkbox"
            :checked="index === 0"
          >
          <div class="collapse-title flex items-center gap-3 py-3 min-h-0">
            <span
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              :class="typeColor(challenge.type)"
            >
              <span v-html="typeIcon(challenge.type)" />
            </span>
            <div>
              <span class="font-medium text-sm capitalize">{{ challenge.label }}</span>
              <span class="text-xs text-base-content/50 ml-2">{{ challenge.items.length }} {{ $t('challenges.challenges') }}</span>
            </div>
          </div>
          <div class="collapse-content">
            <div class="space-y-2 pt-1">
              <div
                v-for="(item, i) in challenge.items"
                :key="i"
                class="flex items-start gap-3 p-3 bg-base-100 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <span class="badge badge-primary badge-sm font-bold mt-0.5">{{ item.amount }}xp</span>
                <p class="text-sm text-base-content/80 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChallengesStore, type Challenge } from '~/stores/challenges'

const { t } = useI18n()
const challenges = useChallengesStore()

interface GroupedChallenge {
  type: string
  label: string
  items: Challenge[]
}

const groupedChallenges = computed<GroupedChallenge[]>(() => {
  const groups = new Map<string, Challenge[]>()
  for (const c of challenges.allChallenges) {
    if (!groups.has(c.type)) groups.set(c.type, [])
    groups.get(c.type)!.push(c)
  }
  const order = ['body', 'eye', 'drink', 'breathe', 'posture', 'meditate', 'walk']
  const result: GroupedChallenge[] = []
  for (const type of order) {
    const items = groups.get(type)
    if (items && items.length > 0) {
      result.push({
        type,
        label: t(`challengeTypes.${type}`),
        items,
      })
    }
  }
  return result
})

function typeColor(type: string) {
  const map: Record<string, string> = {
    body: 'bg-green-500/20 text-green-600',
    eye: 'bg-blue-500/20 text-blue-600',
    drink: 'bg-cyan-500/20 text-cyan-600',
    breathe: 'bg-purple-500/20 text-purple-600',
    posture: 'bg-orange-500/20 text-orange-600',
    meditate: 'bg-indigo-500/20 text-indigo-600',
    walk: 'bg-emerald-500/20 text-emerald-600',
  }
  return map[type] || 'bg-gray-500/20 text-gray-600'
}

function typeIcon(type: string) {
  const icons: Record<string, string> = {
    body: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
    eye: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
    drink:
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>',
    breathe:
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>',
    posture:
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
    meditate:
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
    walk: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>',
  }
  return icons[type] || icons.body
}
</script>
