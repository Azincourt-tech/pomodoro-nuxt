<template>
  <div
    class="card bg-base-100 shadow-sm"
    v-bind="$attrs"
  >
    <div class="card-body p-4">
      <!-- Pomodoro Timer Presets -->
      <div class="flex items-center gap-2 mb-3">
        <svg
          class="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="font-semibold text-sm">
          {{ $t('timer.pomodoroTime') }}
        </h3>
      </div>

      <!-- Preset buttons -->
      <div class="grid grid-cols-4 gap-2 mb-3">
        <button
          v-for="preset in presets"
          :key="preset"
          class="btn btn-sm"
          :class="countdown.customMinutes === preset && !countdown.isBreak ? 'btn-primary' : 'btn-ghost'"
          :disabled="countdown.isActive"
          @click="selectPreset(preset)"
        >
          {{ $t('timer.minutes', { minutes: preset }) }}
        </button>
      </div>

      <!-- Custom input + Apply -->
      <div class="flex gap-2 items-end mb-4">
        <div class="flex-1">
          <label class="label py-1">
            <span class="label-text text-xs">{{ $t('timer.customTime') }}</span>
          </label>
          <input
            v-model.number="customInput"
            type="number"
            min="1"
            max="120"
            placeholder="25"
            class="input input-bordered input-sm w-full"
            :disabled="countdown.isActive"
            @keyup.enter="applyCustom"
          >
        </div>
        <button
          class="btn btn-sm btn-primary shrink-0 h-9"
          :disabled="countdown.isActive || !customInput || customInput < 1"
          @click="applyCustom"
        >
          {{ $t('timer.apply') }}
        </button>
      </div>

      <!-- Break Settings -->
      <div class="divider my-2">{{ $t('timer.breakSettings', 'Configurações de Pausa') }}</div>

      <!-- Short break -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm">{{ $t('timer.shortBreak', 'Pausa curta') }}</span>
        <div class="flex items-center gap-2">
          <input
            v-model.number="breakInput"
            type="number"
            min="1"
            max="30"
            class="input input-bordered input-sm w-20"
          >
          <span class="text-xs">{{ $t('timer.minutes', { minutes: '' }) }}</span>
        </div>
      </div>

      <!-- Long break -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm">{{ $t('timer.longBreak', 'Pausa longa') }}</span>
        <div class="flex items-center gap-2">
          <input
            v-model.number="longBreakInput"
            type="number"
            min="1"
            max="60"
            class="input input-bordered input-sm w-20"
          >
          <span class="text-xs">{{ $t('timer.minutes', { minutes: '' }) }}</span>
        </div>
      </div>

      <!-- Cycles before long break -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm">{{ $t('timer.cyclesBeforeLong', 'Ciclos antes da pausa longa') }}</span>
        <select
          v-model.number="cyclesInput"
          class="select select-bordered select-sm w-20"
        >
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
          <option :value="5">5</option>
          <option :value="6">6</option>
        </select>
      </div>

      <!-- Apply break settings -->
      <button
        class="btn btn-sm btn-secondary w-full mb-4"
        @click="applyBreakSettings"
      >
        {{ $t('timer.applyBreakSettings', 'Aplicar Configurações de Pausa') }}
      </button>

      <!-- Reset button -->
      <button
        class="btn btn-sm gap-1 w-full"
        :class="countdown.isActive ? 'btn-error' : 'btn-ghost btn-outline'"
        :disabled="!countdown.isActive && countdown.time === countdown.customMinutes * 60 && !countdown.isBreak"
        @click="resetTimer"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {{ $t('timer.resetTimer') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCountdownStore } from '~/stores/countdown'

const countdown = useCountdownStore()
const customInput = ref<number | null>(null)
const breakInput = ref(5)
const longBreakInput = ref(15)
const cyclesInput = ref(4)

const presets = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

onMounted(() => {
  breakInput.value = countdown.breakMinutes
  longBreakInput.value = countdown.longBreakMinutes
  cyclesInput.value = countdown.longBreakAfterCycles
})

function selectPreset(minutes: number) {
  countdown.setCustomMinutes(minutes)
  countdown.setBreakMode(false)
  customInput.value = null
}

function applyCustom() {
  if (customInput.value && customInput.value > 0 && customInput.value <= 120) {
    countdown.setCustomMinutes(customInput.value)
    countdown.setBreakMode(false)
  }
}

function applyBreakSettings() {
  if (breakInput.value > 0 && breakInput.value <= 30) {
    countdown.setBreakMinutes(breakInput.value)
  }
  if (longBreakInput.value > 0 && longBreakInput.value <= 60) {
    countdown.setLongBreakMinutes(longBreakInput.value)
  }
  if (cyclesInput.value > 0 && cyclesInput.value <= 10) {
    countdown.setLongBreakAfterCycles(cyclesInput.value)
  }
  if (!countdown.isActive) {
    countdown.setBreakMode(false)
  }
}

function resetTimer() {
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  countdown.resetCompletedCycles()
  countdown.resetTime()
}
</script>
