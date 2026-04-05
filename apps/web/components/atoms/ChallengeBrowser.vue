<template>
  <div class="card bg-base-100 shadow-lg border border-base-300/50 hover:shadow-xl transition-shadow duration-300">
    <div class="card-body p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-warning/10 rounded-lg">
            <svg
              class="w-5 h-5 text-warning"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-base">{{ $t('challenges.allChallenges') }}</h3>
            <p class="text-xs text-base-content/50">{{ challenges.allChallenges.length }} desafios disponíveis</p>
          </div>
        </div>
      </div>

      <!-- Challenge Categories -->
      <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div
          v-for="(group, index) in groupedChallenges"
          :key="index"
          class="collapse collapse-arrow bg-base-200/50 rounded-xl border border-base-300/30 hover:bg-base-200 transition-all duration-200"
          :class="{ 'collapse-open': index === 0 }"
        >
          <input type="checkbox" :checked="index === 0" />
          
          <div class="collapse-title flex items-center gap-3 py-3 min-h-0">
            <!-- Category Icon -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              :class="typeColor(group.type)"
            >
              <span v-html="typeIcon(group.type)" class="text-current" />
            </div>
            
            <!-- Category Info -->
            <div class="flex-1">
              <span class="font-semibold text-sm capitalize">{{ group.label }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-base-content/50">{{ group.items.length }} desafios</span>
                <span class="badge badge-xs badge-primary">{{ group.items[0].amount }}xp</span>
              </div>
            </div>
          </div>
          
          <div class="collapse-content">
            <div class="space-y-2 pt-2">
              <div
                v-for="(item, i) in group.items"
                :key="i"
                class="group flex items-start gap-3 p-3 bg-base-100 rounded-lg border border-base-300/30 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <!-- XP Badge -->
                <div class="flex flex-col items-center gap-1">
                  <span class="badge badge-primary badge-sm font-bold">{{ item.amount }}xp</span>
                </div>
                
                <!-- Description -->
                <p class="text-sm text-base-content/80 leading-relaxed flex-1">
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
    body: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
    eye: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
    drink:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>',
    breathe:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>',
    posture:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
    meditate:
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>',
    walk: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>',
  }
  return icons[type] || icons.body
}
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
  background: hsl(var(--p) / 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--p) / 0.5);
}
</style>
