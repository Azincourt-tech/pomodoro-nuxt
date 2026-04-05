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
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div
          class="flex justify-center items-center font-rajdhani font-bold text-base-content tabular-nums"
          :class="countdown.time >= 6000 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-6xl sm:text-7xl md:text-8xl'"
        >
          <CountdownDigits :digits="countdown.minutes" />
          <span class="px-1 md:px-2 text-primary animate-pulse">:</span>
          <CountdownDigits :digits="countdown.seconds" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, onMounted, onUnmounted } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

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

let INTERVAL_REFERENCE: ReturnType<typeof setInterval> | null = null

function startInterval() {
  if (INTERVAL_REFERENCE) {
    clearInterval(INTERVAL_REFERENCE)
  }
  
  INTERVAL_REFERENCE = setInterval(() => {
    if (countdown.isActive && countdown.time > 0) {
      countdown.setTime(countdown.time - 1)
    } else if (countdown.time <= 0 && countdown.isActive) {
      stopInterval()
      countdown.setIsActive(false)
      emit('completed')
    }
  }, 1000)
}

function stopInterval() {
  if (INTERVAL_REFERENCE) {
    clearInterval(INTERVAL_REFERENCE)
    INTERVAL_REFERENCE = null
  }
}

onMounted(() => {
  // Restart interval if timer was active
  if (countdown.isActive) {
    startInterval()
  }
})

onUnmounted(() => {
  // Don't stop the interval, keep it running
  // The timer state is in the store, not the component
})

watch(
  () => countdown.isActive,
  (isActive) => {
    if (isActive) {
      startInterval()
    } else {
      stopInterval()
    }
  },
)

onUnmounted(() => {
  stopInterval()
})
</script>
