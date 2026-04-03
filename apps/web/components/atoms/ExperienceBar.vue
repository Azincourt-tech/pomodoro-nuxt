<template>
  <div class="mb-4">
    <div class="flex items-center gap-3">
      <span class="badge badge-primary badge-sm font-bold">Lv {{ challenges.level }}</span>
      <span class="text-sm font-medium text-base-content/60">{{ challenges.xp.start }} xp</span>
      <progress
        class="progress progress-success flex-1 h-3"
        :value="challenges.currentXpPercentage"
        max="100"
      />
      <span class="text-sm font-medium text-base-content/60">{{ challenges.xp.end }} xp</span>
    </div>
    <div class="text-center mt-1 flex items-center justify-center gap-3">
      <span class="badge badge-success badge-sm font-medium">
        {{ challenges.xp.current }} xp ({{ challenges.currentXpPercentage }}%)
      </span>
      <!-- Streak badge -->
      <span
        v-if="profile.streakCurrent > 0"
        class="badge badge-error badge-sm font-medium gap-1"
        :title="$t('streak.best', { days: profile.streakBest })"
      >
        {{ fireEmoji }} {{ $t('streak.current', { days: profile.streakCurrent }) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useProfileStore } from '~/stores/profile'

const challenges = useChallengesStore()
const profile = useProfileStore()

const fireEmoji = computed(() => {
  if (profile.streakCurrent >= 30) return '\u{1F525}\u{1F525}\u{1F525}'
  if (profile.streakCurrent >= 7) return '\u{1F525}\u{1F525}'
  return '\u{1F525}'
})
</script>
