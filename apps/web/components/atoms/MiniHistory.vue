<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="font-semibold text-sm">{{ $t('history.title') }}</h3>
        <NuxtLink to="/history" class="ml-auto text-xs text-primary hover:underline">
          {{ $t('history.viewAll', 'Ver tudo') }}
        </NuxtLink>
      </div>

      <div v-if="groupedSessions.length === 0" class="text-center py-6">
        <p class="text-sm text-base-content/50">{{ $t('history.noSessions') }}</p>
      </div>

      <div v-else class="space-y-3 max-h-64 overflow-y-auto pr-1">
        <div v-for="group in groupedSessions" :key="group.dayKey">
          <div class="flex items-center gap-2 mb-1">
            <span class="badge badge-ghost badge-xs">{{ group.label }}</span>
            <span class="text-xs text-base-content/40">{{ group.sessions.length }} {{ $t('history.sessions', 'sessoes') }}</span>
          </div>
          <div class="space-y-1">
            <div
              v-for="session in group.sessions"
              :key="session.id"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-base-200/50 text-sm"
            >
              <span class="text-xs text-base-content/50 w-12">{{ formatTime(session.startedAt) }}</span>
              <span class="badge badge-primary badge-xs font-bold">+{{ session.xpGained }}xp</span>
              <span class="text-xs text-base-content/60 truncate flex-1">
                {{ session.challengeCompleted || $t('history.noChallenge', 'Sem desafio') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '~/stores/history'

const { t } = useI18n()
const history = useHistoryStore()

interface DayGroup {
  dayKey: string
  label: string
  sessions: typeof history.sessions
}

const groupedSessions = computed<DayGroup[]>(() => {
  const groups = new Map<string, typeof history.sessions>()
  for (const session of [...history.sessions].reverse().slice(0, 20)) {
    const date = new Date(session.startedAt)
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    if (!groups.has(dayKey)) groups.set(dayKey, [])
    groups.get(dayKey)!.push(session)
  }
  const result: DayGroup[] = []
  for (const [dayKey, sessions] of groups) {
    const date = new Date(sessions[0].startedAt)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    let label: string
    if (date.toDateString() === today.toDateString()) {
      label = t('history.today', 'Hoje')
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = t('history.yesterday', 'Ontem')
    } else {
      label = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    result.push({ dayKey, label, sessions })
  }
  return result
})

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>
