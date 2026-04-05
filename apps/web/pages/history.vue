<template>
  <div class="py-6 lg:py-10">
    <!-- Back button + title -->
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink
        to="/"
        class="btn btn-ghost btn-sm gap-1"
        :title="$t('nav.back', 'Voltar')"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="text-sm">{{ $t('nav.back', 'Voltar') }}</span>
      </NuxtLink>
      <h1 class="text-2xl font-bold font-rajdhani">
        {{ $t('history.title') }}
      </h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <!-- Level -->
      <div class="stat bg-base-100/80 backdrop-blur-sm rounded-xl shadow-lg border border-base-300/40 hover:shadow-xl transition-all duration-300">
        <div class="stat-figure text-info">
          <svg class="w-9 h-9 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div class="stat-title text-sm">{{ $t('stats.level', 'Level') }}</div>
        <div class="stat-value text-2xl text-info">{{ challenges.level }}</div>
        <div class="stat-desc">{{ challenges.xp.current }} / {{ challenges.xp.end }} xp</div>
      </div>
      <div class="stat bg-base-100 rounded-xl shadow-sm border border-base-300/50">
        <div class="stat-figure text-primary">
          <svg
            class="w-9 h-9 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div class="stat-title text-sm">{{ $t('history.totalSessions') }}</div>
        <div class="stat-value text-2xl text-primary">{{ history.totalSessions }}</div>
      </div>

      <div class="stat bg-base-100 rounded-xl shadow-sm border border-base-300/50">
        <div class="stat-figure text-success">
          <svg
            class="w-9 h-9 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="stat-title text-sm">{{ $t('history.totalTime') }}</div>
        <div class="stat-value text-2xl text-success">{{ history.totalTimeMinutes }}</div>
        <div class="stat-desc">minutos</div>
      </div>

      <div class="stat bg-base-100 rounded-xl shadow-sm border border-base-300/50">
        <div class="stat-figure text-warning">
          <svg
            class="w-9 h-9 drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div class="stat-title text-sm">{{ $t('history.avgDaily') }}</div>
        <div class="stat-value text-2xl text-warning">{{ history.avgDailySessions }}</div>
        <div class="stat-desc">sessoes/dia</div>
      </div>

      <div class="stat bg-base-100 rounded-xl shadow-sm border border-base-300/50">
        <div class="stat-figure text-error">
          <span class="text-3xl drop-shadow-sm">{{ fireEmoji }}</span>
        </div>
        <div class="stat-title text-sm">{{ $t('streak.title') }}</div>
        <div class="stat-value text-2xl text-error">{{ profile.streakCurrent }}</div>
        <div class="stat-desc">{{ $t('streak.best', { days: profile.streakBest }) }}</div>
      </div>
    </div>

    <!-- Sessions List -->
    <div v-if="history.sessions.length === 0" class="text-center py-12">
      <svg
        class="w-16 h-16 mx-auto text-base-content/20 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-base-content/50">{{ $t('history.noSessions') }}</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="dayKey in history.sortedDayKeys"
        :key="dayKey"
      >
        <h2 class="text-sm font-semibold text-base-content/60 mb-3">
          {{ formatDayLabel(dayKey) }}
        </h2>
        <div class="space-y-2">
          <div
            v-for="session in getSessionsForDay(dayKey)"
            :key="session.id"
            class="flex items-center justify-between p-4 bg-base-100/80 backdrop-blur-sm rounded-xl border border-base-300/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  class="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium">
                  {{ $t('history.minutes', { minutes: session.duration }) }}
                </p>
                <p class="text-xs text-base-content/50">
                  {{ formatTime(session.startedAt) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-success">
                {{ $t('history.xpGained', { xp: session.xpGained }) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore, type SessionRecord } from '~/stores/history'
import { useProfileStore } from '~/stores/profile'
import { useChallengesStore } from '~/stores/challenges'

const { t, locale } = useI18n()
const history = useHistoryStore()
const profile = useProfileStore()
const challenges = useChallengesStore()

const fireEmoji = computed(() => {
  if (profile.streakCurrent >= 30) return '\u{1F525}\u{1F525}\u{1F525}'
  if (profile.streakCurrent >= 7) return '\u{1F525}\u{1F525}'
  return '\u{1F525}'
})

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(locale.value === 'pt-BR' ? 'pt-BR' : 'en', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDayLabel(dayKey: string): string {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  if (dayKey === todayKey) return t('history.today')
  if (dayKey === yesterdayKey) return t('history.yesterday')

  const [year, month, day] = dayKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString(locale.value === 'pt-BR' ? 'pt-BR' : 'en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function getSessionsForDay(dayKey: string): SessionRecord[] {
  return history.groupedByDay[dayKey] ?? []
}
</script>
