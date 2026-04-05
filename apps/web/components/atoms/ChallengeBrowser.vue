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
        >
          <input type="checkbox" />
          
          <div class="collapse-title flex items-center gap-3 py-3 min-h-0">
            <!-- Category Icon -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              :class="typeColor(group.type)"
            >
              <Icon :name="typeIcon(group.type)" class="w-6 h-6" />
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
