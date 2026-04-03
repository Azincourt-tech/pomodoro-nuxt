<template>
  <div
    class="card bg-base-100 shadow-sm"
    v-bind="$attrs"
  >
    <div class="card-body p-4">
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

      <!-- Preset buttons - grid 3 cols with uniform gap -->
      <div class="grid grid-cols-3 gap-2 mb-3">
        <button
          v-for="preset in presets"
          :key="preset"
          class="btn btn-sm"
          :class="countdown.customMinutes === preset ? 'btn-primary' : 'btn-ghost'"
          :disabled="countdown.isActive"
          @click="selectPreset(preset)"
        >
          {{ $t('timer.minutes', { minutes: preset }) }}
        </button>
      </div>

      <!-- Custom input + Apply aligned -->
      <div class="flex gap-2 items-end">
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

      <!-- Reset button aligned with grid -->
      <button
        class="btn btn-sm mt-3 gap-1 w-full"
        :class="countdown.isActive ? 'btn-error' : 'btn-ghost btn-outline'"
        :disabled="!countdown.isActive && countdown.time === countdown.customMinutes * 60"
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
import { ref } from 'vue'
import { useCountdownStore } from '~/stores/countdown'

const countdown = useCountdownStore()
const customInput = ref<number | null>(null)

const presets = [15, 25, 35, 45, 60]

function selectPreset(minutes: number) {
  countdown.setCustomMinutes(minutes)
  customInput.value = null
}

function applyCustom() {
  if (customInput.value && customInput.value > 0 && customInput.value <= 120) {
    countdown.setCustomMinutes(customInput.value)
  }
}

function resetTimer() {
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  countdown.resetTime()
}
</script>
