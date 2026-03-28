<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-3">
      <!-- Presets compactos -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="preset in presets"
          :key="preset"
          class="btn btn-xs"
          :class="countdown.customMinutes === preset ? 'btn-primary' : 'btn-ghost'"
          @click="selectPreset(preset)"
          :disabled="countdown.isActive"
        >
          {{ preset }}min
        </button>
        <button
          class="btn btn-xs btn-ghost"
          @click="showCustom = !showCustom"
          :disabled="countdown.isActive"
        >
          Custom
        </button>
      </div>

      <!-- Input customizado (colapsavel) -->
      <div v-if="showCustom" class="form-control mt-2">
        <div class="flex gap-1.5 items-end">
          <input
            v-model.number="customInput"
            type="number"
            min="1"
            max="120"
            placeholder="min"
            class="input input-bordered input-xs w-16"
            :disabled="countdown.isActive"
            @keyup.enter="applyCustom"
          />
          <button
            class="btn btn-xs btn-primary"
            @click="applyCustom"
            :disabled="!customInput || customInput < 1"
          >
            OK
          </button>
        </div>
      </div>

      <!-- Reset (so aparece quando ativo ou diferente do padrao) -->
      <button
        v-if="countdown.isActive || countdown.time !== countdown.customMinutes * 60"
        class="btn btn-ghost btn-xs mt-1 gap-1"
        @click="resetTimer"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Resetar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCountdownStore } from '~/stores/countdown'

const countdown = useCountdownStore()
const customInput = ref<number | null>(null)
const showCustom = ref(false)

const presets = [15, 25, 35, 45, 60]

function selectPreset(minutes: number) {
  countdown.setCustomMinutes(minutes)
  customInput.value = null
  showCustom.value = false
}

function applyCustom() {
  if (customInput.value && customInput.value > 0 && customInput.value <= 120) {
    countdown.setCustomMinutes(customInput.value)
    showCustom.value = false
  }
}

function resetTimer() {
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  countdown.resetTime()
}
</script>
