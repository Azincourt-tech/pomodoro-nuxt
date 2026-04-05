<template>
  <div class="flex flex-col items-center">
    <!-- Circular Timer with Enhanced Visual Effects -->
    <div class="relative inline-flex items-center justify-center group">
      <!-- Outer glow effect -->
      <div 
        class="absolute inset-0 rounded-full blur-3xl opacity-15 transition-all duration-1000"
        :class="countdown.isActive ? 'animate-pulse bg-primary/30' : 'bg-primary/10'"
      />
      
      <!-- Second outer ring for depth -->
      <svg
        class="w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 transform -rotate-90 drop-shadow-2xl relative z-10"
        viewBox="0 0 200 200"
      >
        <!-- Outer ring background -->
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke-width="3"
          class="stroke-primary/10"
        />
        
        <!-- Background circle -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke-width="10"
          class="stroke-base-300/30 dark:stroke-base-300/15 backdrop-blur-sm"
        />
        
        <!-- Progress circle with gradient stroke effect -->
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="1" />
            <stop offset="50%" stop-color="#8b5cf6" stop-opacity="1" />
            <stop offset="100%" stop-color="#ec4899" stop-opacity="1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke="url(#timerGradient)"
          class="transition-all duration-1000 ease-linear"
          filter="url(#glow)"
          :class="countdown.isActive ? 'drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]' : ''"
        />
      </svg>

      <!-- Timer digits inside circle -->
      <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
        <!-- Phase indicator -->
        <div 
          v-if="countdown.isBreak"
          class="mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 backdrop-blur-md border border-cyan-400/40 shadow-lg"
        >
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">🌴 {{ $t('countdown.breakTime', 'Pausa') }}</span>
        </div>
        <div 
          v-else
          class="mb-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-md border border-violet-400/40 shadow-lg"
        >
          <span class="text-xs font-bold text-violet-400 uppercase tracking-wider">⏱️ {{ $t('countdown.focusTime', 'Foco') }}</span>
        </div>
        
        <!-- Timer digits - cleaned up -->
        <div
          class="flex justify-center items-center font-rajdhani font-bold tabular-nums"
          :class="countdown.time >= 60000 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-6xl sm:text-7xl md:text-8xl'"
        >
          <CountdownDigits :digits="countdown.minutes" />
          <span 
            class="px-1 md:px-2 animate-pulse"
            :class="countdown.isActive ? 'text-cyan-400' : 'text-base-content/50'"
          >:</span>
          <CountdownDigits :digits="countdown.seconds" />
        </div>
        
        <!-- Status indicator -->
        <div class="mt-3 flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="countdown.isActive ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-base-content/30'"
          />
          <span class="text-xs font-medium text-base-content/60">
            {{ countdown.isActive ? $t('countdown.running', 'Em execução') : $t('countdown.paused', 'Pausado') }}
          </span>
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
