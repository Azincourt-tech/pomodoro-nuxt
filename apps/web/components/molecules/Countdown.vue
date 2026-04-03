<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Circular Timer -->
    <div class="relative inline-flex items-center justify-center">
      <svg
        class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 transform -rotate-90"
        viewBox="0 0 200 200"
      >
        <!-- Background circle -->
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke-width="8"
          class="stroke-base-300/30"
        />
        <!-- Progress circle -->
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke-width="8"
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

    <!-- Status + Controls below circle -->
    <div class="flex flex-col items-center gap-3">
      <p class="text-sm text-base-content/50 font-medium">
        {{ countdown.hasCompleted ? $t('timer.cycleCompleted') : countdown.isActive ? $t('timer.inProgress') : $t('timer.ready') }}
      </p>

      <div class="flex items-center gap-3">
        <button
          v-if="countdown.hasCompleted"
          disabled
          class="btn btn-disabled btn-sm px-6"
        >
          {{ $t('timer.cycleCompleted') }}
        </button>
        <template v-else>
          <button
            v-if="!countdown.isActive"
            class="btn btn-primary btn-sm gap-2 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
            @click="$emit('start')"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {{ $t('timer.startCycle') }}
          </button>
          <template v-else>
            <button
              class="btn btn-error btn-outline btn-sm gap-2 px-6"
              @click="$emit('pause')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t('timer.pause') }}
            </button>
            <button
              class="btn btn-ghost btn-sm px-3"
              @click="$emit('reset')"
              :title="$t('timer.reset', 'Resetar')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

const emit = defineEmits<{
  start: []
  pause: []
  reset: []
  completed: []
}>()

const countdown = useCountdownStore()

const circumference = 2 * Math.PI * 88
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
