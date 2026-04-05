<template>
  <div
    class="card bg-base-100/80 backdrop-blur-md shadow-2xl border border-base-300/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1"
    v-bind="$attrs"
  >
    <div class="card-body p-6">
      <!-- Header with icon -->
      <div class="flex items-center gap-3 mb-5">
        <div class="p-2.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl shadow-lg">
          <Icon name="lucide:timer" class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 class="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {{ $t('timer.pomodoroTime') }}
          </h3>
          <p class="text-xs text-base-content/50">{{ $t('timer.presetsSub', 'Escolha a duração do timer') }}</p>
        </div>
      </div>

      <!-- Preset buttons grid -->
      <div class="grid grid-cols-4 gap-2.5 mb-4">
        <button
          v-for="preset in presets"
          :key="preset"
          class="group relative overflow-hidden btn btn-sm transition-all duration-300 hover:scale-105"
          :class="countdown.customMinutes === preset && !countdown.isBreak 
            ? 'btn-primary shadow-lg hover:shadow-xl scale-105' 
            : 'btn-ghost hover:bg-primary/10 hover:border-primary/30'"
          :disabled="countdown.isActive"
          @click="selectPreset(preset)"
        >
          <!-- Ripple effect on active button -->
          <div 
            v-if="countdown.customMinutes === preset && !countdown.isBreak"
            class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"
          />
          <span class="relative z-10 font-semibold">{{ preset }}</span>
        </button>
      </div>

      <!-- Custom time input with enhanced design -->
      <div class="relative mb-5">
        <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl blur-lg -z-10" />
        <div class="bg-base-200/50 backdrop-blur-sm rounded-xl p-4 border border-base-300/30">
          <label class="label py-1">
            <span class="label-text text-xs font-medium flex items-center gap-1.5">
              <Icon name="lucide:edit" class="w-3.5 h-3.5" />
              {{ $t('timer.customTime') }}
            </span>
          </label>
          <div class="flex gap-2 items-end">
            <input
              v-model.number="customInput"
              type="number"
              min="1"
              max="120"
              placeholder="25"
              class="input input-bordered input-sm w-full focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm"
              :disabled="countdown.isActive"
              @keyup.enter="applyCustom"
            >
            <button
              class="btn btn-sm btn-primary shrink-0 h-9 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              :disabled="countdown.isActive || !customInput || customInput < 1"
              @click="applyCustom"
            >
              <Icon name="lucide:check" class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span class="hidden sm:inline">{{ $t('timer.apply') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Break Settings section -->
      <div class="divider my-3">
        <div class="flex items-center gap-2 px-2 py-1 bg-base-300/50 rounded-lg">
          <Icon name="lucide:coffee" class="w-4 h-4 text-secondary" />
          <span class="text-sm font-semibold">{{ $t('timer.breakSettings', 'Configurações de Pausa') }}</span>
        </div>
      </div>

      <!-- Break settings with cards -->
      <div class="space-y-3 mb-4">
        <!-- Short break -->
        <div class="bg-base-200/40 backdrop-blur-sm rounded-xl p-3.5 border border-base-300/20 hover:border-secondary/30 transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-secondary/10 rounded-lg">
                <Icon name="lucide:coffee" class="w-4 h-4 text-secondary" />
              </div>
              <span class="text-sm font-medium">{{ $t('timer.shortBreak', 'Pausa curta') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model.number="breakInput"
                type="number"
                min="1"
                max="30"
                class="input input-bordered input-sm w-20 focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all text-center"
              >
              <span class="text-xs text-base-content/60">min</span>
            </div>
          </div>
        </div>

        <!-- Long break -->
        <div class="bg-base-200/40 backdrop-blur-sm rounded-xl p-3.5 border border-base-300/20 hover:border-secondary/30 transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-secondary/10 rounded-lg">
                <Icon name="lucide:wind" class="w-4 h-4 text-secondary" />
              </div>
              <span class="text-sm font-medium">{{ $t('timer.longBreak', 'Pausa longa') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model.number="longBreakInput"
                type="number"
                min="1"
                max="60"
                class="input input-bordered input-sm w-20 focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all text-center"
              >
              <span class="text-xs text-base-content/60">min</span>
            </div>
          </div>
        </div>

        <!-- Cycles -->
        <div class="bg-base-200/40 backdrop-blur-sm rounded-xl p-3.5 border border-base-300/20 hover:border-secondary/30 transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-secondary/10 rounded-lg">
                <Icon name="lucide:repeat" class="w-4 h-4 text-secondary" />
              </div>
              <span class="text-sm font-medium">{{ $t('timer.cyclesBeforeLong', 'Ciclos antes da pausa longa') }}</span>
            </div>
            <select
              v-model.number="cyclesInput"
              class="select select-bordered select-sm w-20 focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-all bg-base-100/80"
            >
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
              <option :value="6">6</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Apply button with gradient -->
      <button
        class="btn btn-secondary w-full mb-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden relative"
        @click="applyBreakSettings"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon name="lucide:check" class="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
        <span class="relative z-10">{{ $t('timer.applyBreakSettings', 'Aplicar') }}</span>
      </button>

      <!-- Reset button -->
      <button
        class="btn w-full transition-all duration-300 group relative overflow-hidden hover:shadow-lg"
        :class="countdown.isActive ? 'btn-error' : 'btn-ghost btn-outline hover:bg-error/10 hover:border-error/30'"
        :disabled="!countdown.isActive && countdown.time === countdown.customMinutes * 60 && !countdown.isBreak"
        @click="resetTimer"
      >
        <Icon name="lucide:rotate-ccw" class="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
        <span>{{ $t('timer.resetTimer') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const countdown = useCountdownStore()
const { success } = useToast()
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
  success(t('timer.presetApplied', 'Tempo aplicado: {minutes}min', { minutes }))
}

function applyCustom() {
  if (customInput.value && customInput.value > 0 && customInput.value <= 120) {
    countdown.setCustomMinutes(customInput.value)
    countdown.setBreakMode(false)
    success(t('timer.customTimeApplied', 'Tempo personalizado aplicado: {minutes}min', { minutes: customInput.value }))
  }
}

function applyBreakSettings() {
  let applied = []
  
  if (breakInput.value > 0 && breakInput.value <= 30) {
    countdown.setBreakMinutes(breakInput.value)
    applied.push(`${breakInput.value}min`)
  }
  if (longBreakInput.value > 0 && longBreakInput.value <= 60) {
    countdown.setLongBreakMinutes(longBreakInput.value)
    applied.push(`${longBreakInput.value}min`)
  }
  if (cyclesInput.value > 0 && cyclesInput.value <= 10) {
    countdown.setLongBreakAfterCycles(cyclesInput.value)
    applied.push(`${cyclesInput.value} ciclos`)
  }
  
  if (!countdown.isActive) {
    countdown.setBreakMode(false)
  }
  
  if (applied.length > 0) {
    success(t('timer.breakSettingsApplied', 'Configurações de pausa aplicadas: {settings}', { 
      settings: applied.join(', ') 
    }))
  }
}

function resetTimer() {
  countdown.setIsActive(false)
  countdown.setHasCompleted(false)
  countdown.resetCompletedCycles()
  countdown.resetTime()
  success(t('timer.timerReset', 'Timer resetado'))
}
</script>
