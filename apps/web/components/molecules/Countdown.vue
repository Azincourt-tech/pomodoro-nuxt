<template>
  <div class="flex flex-col items-center">
    <!-- Circular Timer -->
    <div class="relative inline-flex items-center justify-center">
      <svg
        class="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 transform -rotate-90"
        viewBox="0 0 200 200"
      >
        <!-- Background circle -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke-width="6"
          class="stroke-base-300/30"
        />
        <!-- Progress circle -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="stroke-primary transition-all duration-1000 ease-linear"
        />
      </svg>

      <!-- Timer digits inside circle -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span
          class="font-rajdhani font-bold text-base-content tabular-nums select-none"
          :class="countdown.time >= 6000 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-6xl sm:text-7xl md:text-8xl'"
        >{{ countdown.minutes }}:{{ countdown.seconds }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useCountdownStore } from '~/stores/countdown'

const emit = defineEmits<{
  completed: []
}>()

const countdown = useCountdownStore()

const circumference = 2 * Math.PI * 90
const progress = computed(() => {
  const total = countdown.customMinutes * 60
  if (total === 0) return 0
  return 1 - (countdown.time / total)
})
const dashOffset = computed(() => circumference * (1 - progress.value))

let TIMEOUT_REFERENCE: ReturnType<typeof setTimeout>

function runCountdown(flag: boolean) {
  if (countdown.isActive && flag) {
    TIMEOUT_REFERENCE = setTimeout(() => countdown.setTime(countdown.time - 1), 1000)
  }
  else {
    clearTimeout(TIMEOUT_REFERENCE)
  }
}

watch(
  () => countdown.isActive,
  (v) => {
    if (v) {
      runCountdown(true)
    } else {
      clearTimeout(TIMEOUT_REFERENCE)
    }
  },
)

watch(
  () => countdown.time,
  (v) => {
    if (v > 0) runCountdown(true)
    else if (v <= 0 && countdown.isActive) {
      clearTimeout(TIMEOUT_REFERENCE)
      emit('completed')
    }
  },
)
</script>
