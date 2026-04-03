<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="font-semibold text-sm">{{ $t('challenges.recentTitle', 'Desafios Recentes') }}</h3>
        <NuxtLink to="/history" class="ml-auto text-xs text-primary hover:underline">
          {{ $t('history.viewAll', 'Ver tudo') }}
        </NuxtLink>
      </div>

      <div v-if="recentChallenges.length === 0" class="text-center py-6">
        <p class="text-sm text-base-content/50">{{ $t('challenges.noRecent', 'Nenhum desafio ainda') }}</p>
      </div>

      <div v-else class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        <div
          v-for="(item, i) in recentChallenges"
          :key="i"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200/50 text-sm"
        >
          <span
            v-if="item.completed"
            class="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span
            v-else
            class="w-5 h-5 rounded-full bg-error/20 text-error flex items-center justify-center shrink-0"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <span class="truncate flex-1 text-base-content/80">{{ item.description }}</span>
          <span class="badge badge-xs" :class="item.completed ? 'badge-success' : 'badge-ghost'">
            {{ item.completed ? '+' + item.xpGained + 'xp' : $t('challenges.skipped', 'pulou') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '~/stores/history'

const history = useHistoryStore()

const recentChallenges = computed(() => {
  return [...history.sessions]
    .reverse()
    .slice(0, 15)
    .map(s => ({
      description: s.challengeCompleted || 'Ciclo completado',
      completed: !!s.challengeCompleted && s.xpGained > 0,
      xpGained: s.xpGained,
    }))
})
</script>
