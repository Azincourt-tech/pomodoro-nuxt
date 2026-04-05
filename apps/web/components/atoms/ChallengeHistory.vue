<template>
  <div class="card bg-gradient-to-br from-base-100/90 via-base-100/85 to-base-200/70 backdrop-blur-xl shadow-2xl border border-success/20 hover:shadow-[0_25px_60px_rgba(34,197,94,0.2)] hover:border-success/40 transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-success/10 rounded-full blur-3xl group-hover:bg-success/15 transition-all duration-700" />
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-all duration-700" />
    </div>
    
    <div class="card-body p-6 relative z-10">
      <!-- Header with animated icon -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-br from-success/20 to-success/5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon name="lucide:circle-check" class="w-6 h-6 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
          <div>
            <h3 class="font-bold text-lg bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">{{ $t('challenges.recentTitle', 'Desafios Recentes') }}</h3>
            <p class="text-xs text-base-content/50 flex items-center gap-1.5">
              <Icon name="lucide:history" class="w-3 h-3" />
              Últimos 15 desafios
            </p>
          </div>
        </div>
        <NuxtLink to="/history" class="btn btn-ghost btn-sm gap-2 group/btn hover:bg-success/10 hover:text-success transition-all duration-300">
          <span>{{ $t('history.viewAll', 'Ver tudo') }}</span>
          <Icon name="lucide:arrow-right" class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </NuxtLink>
      </div>

      <!-- Empty State with enhanced design -->
      <div v-if="recentChallenges.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-success/10 to-success/5 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
          <Icon name="lucide:clipboard-list" class="w-10 h-10 text-success/40" />
        </div>
        <p class="text-sm text-base-content/50 font-medium">{{ $t('challenges.noRecent', 'Nenhum desafio ainda') }}</p>
        <p class="text-xs text-base-content/40 mt-1.5 flex items-center justify-center gap-1.5">
          <Icon name="lucide:play" class="w-3 h-3" />
          {{ $t('challenges.startCycle', 'Inicie um ciclo para começar') }}
        </p>
      </div>

      <!-- Challenge List with enhanced items -->
      <div v-else class="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
        <div
          v-for="(item, i) in recentChallenges"
          :key="i"
          class="group/item flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-success/10 hover:-translate-y-0.5"
          :class="item.completed 
            ? 'bg-gradient-to-r from-success/10 to-success/5 border-success/25 hover:border-success/50' 
            : 'bg-gradient-to-r from-error/10 to-error/5 border-error/25 hover:border-error/50'"
          :style="{ animationDelay: `${i * 50}ms` }"
        >
          <!-- Status Icon with animation -->
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/item:scale-110"
            :class="item.completed 
              ? 'bg-gradient-to-br from-success to-success/85 text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
              : 'bg-gradient-to-br from-error to-error/85 text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'"
          >
            <Icon v-if="item.completed" name="lucide:check" class="w-6 h-6" />
            <Icon v-else name="lucide:x" class="w-6 h-6" />
          </div>
          
          <!-- Description -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-base-content/85 truncate group-hover/item:text-base-content transition-colors">{{ item.description }}</p>
            <div class="flex items-center gap-2 mt-1">
              <Icon name="lucide:calendar" class="w-3 h-3 text-base-content/40" />
              <p class="text-xs text-base-content/50">{{ item.completed ? 'Completado' : 'Pulado' }}</p>
            </div>
          </div>
          
          <!-- XP Badge with gradient -->
          <div
            class="badge badge-sm font-bold shadow-md bg-gradient-to-br border-0"
            :class="item.completed 
              ? 'badge-success from-success to-success/80' 
              : 'badge-ghost from-base-300 to-base-300/80'"
          >
            <Icon v-if="item.completed" name="lucide:star" class="w-3 h-3 mr-1" />
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
  background: hsl(var(--b2) / 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, hsl(var(--su) / 0.4), hsl(var(--su) / 0.6));
  border-radius: 10px;
  transition: all 0.3s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, hsl(var(--su) / 0.6), hsl(var(--su) / 0.8));
}
</style>
