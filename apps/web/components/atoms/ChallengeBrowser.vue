<template>
  <div class="card bg-base-200 shadow-2xl border border-warning/20 hover:shadow-[0_25px_60px_rgba(234,179,8,0.2)] hover:border-warning/40 transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-warning/10 rounded-full blur-3xl group-hover:bg-warning/15 transition-all duration-700" />
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-warning/5 rounded-full blur-3xl group-hover:bg-warning/10 transition-all duration-700" />
    </div>
    
    <div class="card-body p-6 relative z-10">
      <!-- Header with animated icon -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-br from-warning/20 to-warning/5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon name="lucide:trophy" class="w-6 h-6 text-warning drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          </div>
          <div>
            <h3 class="font-bold text-lg bg-gradient-to-r from-warning to-warning/70 bg-clip-text text-transparent">{{ $t('challenges.allChallenges') }}</h3>
            <p class="text-xs text-base-content/50 flex items-center gap-1.5">
              <Icon name="lucide:sparkles" class="w-3 h-3" />
              {{ challenges.allChallenges.length }} desafios disponíveis
            </p>
          </div>
        </div>
      </div>

      <!-- Challenge Categories with enhanced design -->
      <div class="space-y-2.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-1">
        <div
          v-for="(group, index) in groupedChallenges"
          :key="index"
          class="collapse collapse-arrow bg-base-200/30 backdrop-blur-sm rounded-xl border border-base-300/20 hover:bg-base-200/50 hover:border-warning/30 transition-all duration-300 group/collapse"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <input type="checkbox" />
          
          <div class="collapse-title flex items-center gap-3 py-3.5 min-h-0 group-hover/collapse:scale-[1.01] transition-transform duration-200">
            <!-- Category Icon with glow -->
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover/collapse:scale-105"
              :class="typeColor(group.type)"
            >
              <Icon :name="typeIcon(group.type)" class="w-6 h-6 drop-shadow-md" />
            </div>
            
            <!-- Category Info -->
            <div class="flex-1">
              <span class="font-bold text-sm capitalize">{{ group.label }}</span>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-base-content/50 flex items-center gap-1">
                  <Icon name="lucide:list" class="w-3 h-3" />
                  {{ group.items.length }} desafios
                </span>
                <span v-if="group.items.length > 0" class="text-xs text-base-content/50">
                  • {{ getAvgXP(group.items) }}xp médio
                </span>
              </div>
            </div>
          </div>
          
          <div class="collapse-content">
            <div class="space-y-2 pt-3">
              <div
                v-for="(item, i) in group.items"
                :key="i"
                class="group/item flex items-start gap-3 p-3.5 bg-gradient-to-r from-base-100/80 to-base-100/60 backdrop-blur-sm rounded-xl border border-base-300/20 hover:border-warning/40 hover:shadow-lg hover:shadow-warning/10 transition-all duration-300 hover:-translate-y-0.5"
                :style="{ animationDelay: `${i * 30}ms` }"
              >
                <!-- XP Badge with gradient -->
                <div class="flex flex-col items-center gap-1">
                  <span class="badge badge-warning badge-sm font-bold shadow-md bg-gradient-to-br from-warning to-warning/80 border-0">{{ item.amount }}xp</span>
                </div>
                
                <!-- Description -->
                <p class="text-sm text-base-content/80 leading-relaxed flex-1 group-hover/item:text-base-content transition-colors">
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
    body: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
    eye: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    drink: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white',
    breathe: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    posture: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    meditate: 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white',
    walk: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white',
  }
  return map[type] || 'bg-gray-400 text-white'
}

function typeIcon(type: string) {
  const icons: Record<string, string> = {
    body: 'lucide:activity',
    eye: 'lucide:eye',
    drink: 'lucide:droplets',
    breathe: 'lucide:wind',
    posture: 'lucide:user-check',
    meditate: 'lucide:sparkles',
    walk: 'lucide:trending-up',
  }
  return icons[type] || icons.body
}

function getAvgXP(items: Challenge[]): number {
  if (items.length === 0) return 0
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  return Math.round(total / items.length)
}
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
  background: linear-gradient(to bottom, hsl(var(--wa) / 0.4), hsl(var(--wa) / 0.6));
  border-radius: 10px;
  transition: all 0.3s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, hsl(var(--wa) / 0.6), hsl(var(--wa) / 0.8));
}
</style>
