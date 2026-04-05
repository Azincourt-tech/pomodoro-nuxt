<template>
  <div class="flex flex-col items-center">
    <!-- Circular Timer with Enhanced Visual Effects -->
    <div class="relative inline-flex items-center justify-center group">
      <!-- Outer glow effect -->
      <div 
        class="absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000"
        :class="countdown.isActive ? 'animate-pulse bg-primary/40' : 'bg-primary/10'"
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
          stroke-width="8"
          class="stroke-base-300/20 backdrop-blur-sm"
        />
        
        <!-- Progress circle with gradient stroke effect -->
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="'hsl(var(--p))'" stop-opacity="1" />
            <stop offset="100%" :stop-color="'hsl(var(--s))'" stop-opacity="0.8" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke="url(#timerGradient)"
          class="transition-all duration-1000 ease-linear drop-shadow-lg"
          :class="{ 'filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]': countdown.isActive }"
        />
      </svg>

      <!-- Timer digits inside circle -->
      <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
        <!-- Phase indicator -->
        <div 
          v-if="countdown.isBreak"
          class="mb-2 px-3 py-1 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 shadow-lg"
        >
          <span class="text-xs font-bold text-secondary uppercase tracking-wider">🌴 {{ $t('countdown.breakTime', 'Pausa') }}</span>
        </div>
        <div 
          v-else
          class="mb-2 px-3 py-1 rounded-full bg-primary/15 backdrop-blur-md border border-primary/25 shadow-lg"
        >
          <span class="text-xs font-bold text-primary uppercase tracking-wider">⏱️ {{ $t('countdown.focusTime', 'Foco') }}</span>
        </div>
        
        <!-- Timer digits with glass effect -->
        <div
          class="flex justify-center items-center font-rajdhani font-bold tabular-nums relative"
          :class="countdown.time >= 60000 ? 'text-5xl sm:text-6xl md:text-7xl' : 'text-6xl sm:text-7xl md:text-8xl'"
        >
          <!-- Background glow for digits -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
          
          <CountdownDigits :digits="countdown.minutes" />
          <span 
            class="px-1 md:px-2 animate-pulse"
            :class="countdown.isActive ? 'text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'text-base-content/50'"
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
