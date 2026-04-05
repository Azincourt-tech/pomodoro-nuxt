<template>
  <div class="py-6 lg:py-10">
    <!-- Back button + title - Modernized -->
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink
        to="/"
        class="btn btn-ghost btn-sm gap-2 group hover:bg-base-200/60 transition-all duration-300"
        :title="$t('nav.back', 'Voltar')"
      >
        <Icon name="lucide:arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span class="text-sm font-medium">{{ $t('nav.back', 'Voltar') }}</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <div class="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
          <Icon name="lucide:history" class="w-5 h-5 text-primary" />
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold font-rajdhani bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ $t('history.title') }}
        </h1>
      </div>
    </div>

    <!-- Stats Cards - Modernized with glassmorphism -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
      <!-- Level Card -->
      <div class="stats bg-gradient-to-br from-base-100/90 to-base-200/70 backdrop-blur-xl rounded-2xl shadow-xl border border-info/20 hover:shadow-2xl hover:shadow-info/20 hover:-translate-y-1 transition-all duration-500">
        <div class="stat">
          <div class="stat-figure text-info">
            <div class="p-2 bg-gradient-to-br from-info/20 to-info/5 rounded-xl">
              <Icon name="lucide:star" class="w-8 h-8 text-info drop-shadow-lg" />
            </div>
          </div>
          <div class="stat-title text-xs font-semibold">{{ $t('stats.level', 'Level') }}</div>
          <div class="stat-value text-3xl text-info font-black">{{ challenges.level }}</div>
          <div class="stat-desc">
            <div class="flex items-center gap-1 mt-1">
              <Icon name="lucide:trending-up" class="w-3 h-3" />
              {{ challenges.xp.current }} / {{ challenges.xp.end }} xp
            </div>
          </div>
        </div>
      </div>

      <!-- Sessions Card -->
      <div class="stats bg-gradient-to-br from-base-100/90 to-base-200/70 backdrop-blur-xl rounded-2xl shadow-xl border border-primary/20 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500">
        <div class="stat">
          <div class="stat-figure text-primary">
            <div class="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
              <Icon name="lucide:calendar" class="w-8 h-8 text-primary drop-shadow-lg" />
            </div>
          </div>
          <div class="stat-title text-xs font-semibold">{{ $t('history.totalSessions') }}</div>
          <div class="stat-value text-3xl text-primary font-black">{{ history.totalSessions }}</div>
        </div>
      </div>

      <!-- Time Card -->
      <div class="stats bg-gradient-to-br from-base-100/90 to-base-200/70 backdrop-blur-xl rounded-2xl shadow-xl border border-success/20 hover:shadow-2xl hover:shadow-success/20 hover:-translate-y-1 transition-all duration-500">
        <div class="stat">
          <div class="stat-figure text-success">
            <div class="p-2 bg-gradient-to-br from-success/20 to-success/5 rounded-xl">
              <Icon name="lucide:clock" class="w-8 h-8 text-success drop-shadow-lg" />
            </div>
          </div>
          <div class="stat-title text-xs font-semibold">{{ $t('history.totalTime') }}</div>
          <div class="stat-value text-3xl text-success font-black">{{ history.totalTimeMinutes }}</div>
          <div class="stat-desc flex items-center gap-1">
            <Icon name="lucide:timer" class="w-3 h-3" />
            minutos
          </div>
        </div>
      </div>

      <!-- Daily Average Card -->
      <div class="stats bg-gradient-to-br from-base-100/90 to-base-200/70 backdrop-blur-xl rounded-2xl shadow-xl border border-warning/20 hover:shadow-2xl hover:shadow-warning/20 hover:-translate-y-1 transition-all duration-500">
        <div class="stat">
          <div class="stat-figure text-warning">
            <div class="p-2 bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl">
              <Icon name="lucide:activity" class="w-8 h-8 text-warning drop-shadow-lg" />
            </div>
          </div>
          <div class="stat-title text-xs font-semibold">{{ $t('history.avgDaily') }}</div>
          <div class="stat-value text-3xl text-warning font-black">{{ history.avgDailySessions }}</div>
          <div class="stat-desc flex items-center gap-1">
            <Icon name="lucide:zap" class="w-3 h-3" />
            sessoes/dia
          </div>
        </div>
      </div>

      <!-- Streak Card -->
      <div class="stats bg-gradient-to-br from-base-100/90 to-base-200/70 backdrop-blur-xl rounded-2xl shadow-xl border border-error/20 hover:shadow-2xl hover:shadow-error/20 hover:-translate-y-1 transition-all duration-500">
        <div class="stat">
          <div class="stat-figure text-error">
            <div class="p-2 bg-gradient-to-br from-error/20 to-error/5 rounded-xl">
              <Icon name="lucide:flame" class="w-8 h-8 text-error drop-shadow-lg animate-pulse" />
            </div>
          </div>
          <div class="stat-title text-xs font-semibold">{{ $t('streak.title') }}</div>
          <div class="stat-value text-3xl text-error font-black">{{ profile.streakCurrent }}</div>
          <div class="stat-desc flex items-center gap-1">
            <Icon name="lucide:trophy" class="w-3 h-3" />
            {{ $t('streak.best', { days: profile.streakBest }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Sessions List - Modernized -->
    <div v-if="history.sessions.length === 0" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-base-200/80 to-base-300/60 mb-6 shadow-lg">
        <Icon name="lucide:inbox" class="w-12 h-12 text-base-content/30" />
      </div>
      <p class="text-base-content/50 font-medium text-lg">{{ $t('history.noSessions') }}</p>
      <p class="text-base-content/40 text-sm mt-2 flex items-center justify-center gap-2">
        <Icon name="lucide:play" class="w-4 h-4" />
        Inicie um ciclo para comecar
      </p>
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="dayKey in history.sortedDayKeys"
        :key="dayKey"
        class="animate-fadeIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent" />
          <h2 class="text-sm font-bold text-base-content/70 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20">
            {{ formatDayLabel(dayKey) }}
          </h2>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-base-300/50 to-transparent" />
        </div>
        <div class="space-y-3">
          <div
            v-for="session in getSessionsForDay(dayKey)"
            :key="session.id"
            class="group flex items-center justify-between p-5 bg-gradient-to-r from-base-100/80 via-base-100/60 to-base-200/50 backdrop-blur-xl rounded-2xl border border-base-300/20 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                <Icon name="lucide:timer" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <p class="text-base font-bold text-base-content/90">
                  {{ $t('history.minutes', { minutes: session.duration }) }}
                </p>
                <div class="flex items-center gap-1.5 mt-1">
                  <Icon name="lucide:clock" class="w-3.5 h-3.5 text-base-content/40" />
                  <p class="text-xs text-base-content/50">
                    {{ formatTime(session.startedAt) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="badge badge-success badge-lg font-bold shadow-md bg-gradient-to-br from-success to-success/80 border-0">
                <Icon name="lucide:star" class="w-3.5 h-3.5 mr-1" />
                {{ $t('history.xpGained', { xp: session.xpGained }) }}
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
</style>
