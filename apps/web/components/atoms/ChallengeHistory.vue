<template>
  <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
    <div class="card-body p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-success/10 rounded-lg">
            <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </div>
          <div>
            <h3 class="font-bold text-base">{{ $t('challenges.recentTitle', 'Desafios Recentes') }}</h3>
            <p class="text-xs text-base-content/50">Últimos 15 desafios</p>
          </div>
        </div>
        <NuxtLink to="/history" class="btn btn-ghost btn-sm gap-2 group">
          <span>{{ $t('history.viewAll', 'Ver tudo') }}</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="recentChallenges.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/50 mb-3">
          <svg class="w-8 h-8 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </div>
        <p class="text-sm text-base-content/50">{{ $t('challenges.noRecent', 'Nenhum desafio ainda') }}</p>
        <p class="text-xs text-base-content/40 mt-1">{{ $t('challenges.startCycle', 'Inicie um ciclo para começar') }}</p>
      </div>

      <!-- Challenge List -->
      <div v-else class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <div
          v-for="(item, i) in recentChallenges"
          :key="i"
          class="group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md"
          :class="item.completed ? 'bg-success/5 border-success/20 hover:border-success/40' : 'bg-error/5 border-error/20 hover:border-error/40'"
        >
          <!-- Status Icon -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            :class="item.completed ? 'bg-gradient-to-br from-success to-success/80 text-white' : 'bg-gradient-to-br from-error to-error/80 text-white'"
          >
            <Icon v-if="item.completed" name="lucide:check" class="w-5 h-5" />
            <Icon v-else name="lucide:x" class="w-5 h-5" />
          </div>
          
          <!-- Description -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-base-content/80 truncate">{{ item.description }}</p>
            <p class="text-xs text-base-content/50 mt-0.5">{{ item.completed ? 'Completado' : 'Pulado' }}</p>
          </div>
          
          <!-- XP Badge -->
          <div
            class="badge font-bold shadow-sm"
            :class="item.completed ? 'badge-success' : 'badge-ghost'"
          >
            {{ item.completed ? `+${item.xpGained}xp` : $t('challenges.skipped', 'pulou') }}
          </div>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--b2));
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--su) / 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--su) / 0.5);
}
</style>
