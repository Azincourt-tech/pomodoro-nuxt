<template>
  <div class="py-4 lg:py-6 space-y-4 lg:space-y-6">
    <!-- PiP Window com botao -->
    <PiPWindow />

    <!-- Hero Timer Section -->
    <div class="card bg-gradient-to-br from-base-100 to-base-200 shadow-lg">
      <div class="card-body p-4 lg:p-6">
        <div class="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <!-- Timer Display -->
          <div class="flex-1 flex flex-col items-center">
            <div class="flex items-center justify-center text-6xl md:text-8xl lg:text-[10rem] font-rajdhani font-bold text-base-content">
              <CountdownDigits :digits="countdown.minutes" />
              <span class="px-2 md:px-4 text-primary animate-pulse">:</span>
              <CountdownDigits :digits="countdown.seconds" />
            </div>

            <!-- Status badge -->
            <div class="mt-2">
              <span
                v-if="countdown.isActive"
                class="badge badge-success badge-lg gap-2"
              >
                <span class="loading loading-dots loading-xs" />
                {{ $t('timer.inProgress') }}
              </span>
              <span
                v-else-if="countdown.hasCompleted"
                class="badge badge-primary badge-lg gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ $t('timer.cycleCompleted') }}
              </span>
              <span
                v-else
                class="badge badge-ghost badge-lg"
              >
                {{ $t('timer.ready') }}
              </span>
            </div>
          </div>

          <!-- Controls + Presets -->
          <div class="flex flex-col gap-4 w-full lg:w-80">
            <!-- Action Button -->
            <button
              v-if="countdown.hasCompleted"
              disabled
              class="btn btn-disabled btn-block h-14 text-base font-semibold rounded-xl"
            >
              {{ $t('timer.cycleCompleted') }}
            </button>
            <button
              v-else-if="countdown.isActive"
              class="btn btn-error btn-outline btn-block h-14 text-base font-semibold rounded-xl"
              @click="setCountdownState(false)"
            >
              {{ $t('timer.abandonCycle') }}
            </button>
            <button
              v-else
              class="btn btn-primary btn-block h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
              @click="setCountdownState(true)"
            >
              {{ $t('timer.startCycle') }}
            </button>

            <!-- Timer Presets (inline) -->
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="preset in [15, 25, 35, 45, 60]"
                :key="preset"
                class="btn btn-sm"
                :class="countdown.customMinutes === preset ? 'btn-primary' : 'btn-ghost'"
                :disabled="countdown.isActive"
                @click="selectPreset(preset)"
              >
                {{ preset }}min
              </button>
            </div>

            <!-- Custom time input -->
            <div class="flex gap-2">
              <input
                v-model.number="customInput"
                type="number"
                min="1"
                max="120"
                :placeholder="$t('timer.customTime')"
                class="input input-bordered input-sm flex-1"
                :disabled="countdown.isActive"
                @keyup.enter="applyCustom"
              >
              <button
                class="btn btn-sm btn-outline"
                :disabled="countdown.isActive || !customInput || customInput < 1"
                @click="applyCustom"
              >
                {{ $t('timer.apply') }}
              </button>
            </div>

            <!-- Reset button -->
            <button
              class="btn btn-sm gap-1 w-full"
              :class="countdown.isActive ? 'btn-error' : 'btn-ghost'"
              :disabled="!countdown.isActive && countdown.time === countdown.customMinutes * 60"
              @click="resetTimer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ $t('timer.resetTimer') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Challenge Card (appears when cycle completes) -->
    <div
      v-if="challenges.currentChallenge || countdown.hasCompleted"
      id="challenge"
    >
      <Card />
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <!-- Left Column: Profile + Stats -->
      <div class="flex flex-col gap-4">
        <Profile />

        <!-- Stats Row -->
        <div class="stats stats-vertical lg:stats-horizontal shadow-sm bg-base-100">
          <div class="stat p-4">
            <div class="stat-title text-xs">
              {{ $t('challenges.completedChallenges') }}
            </div>
            <div class="stat-value text-primary text-2xl">
              {{ challenges.completedChallenges }}
            </div>
          </div>
          <div class="stat p-4">
            <div class="stat-title text-xs">
              {{ $t('nav.level', { level: '' }) }}
            </div>
            <div class="stat-value text-warning text-2xl">
              {{ challenges.level }}
            </div>
          </div>
        </div>

        <!-- Experience Bar -->
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <ExperienceBar />
          </div>
        </div>

        <!-- Completed Challenges List -->
        <CompletedChallenges />
      </div>

      <!-- Middle Column: Spotify -->
      <div class="lg:col-span-1">
        <SpotifyPlayer class="h-full" />
      </div>

      <!-- Right Column: Challenge Browser -->
      <div class="lg:col-span-1">
        <ChallengeBrowser class="h-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useThemeStore } from '~/stores/theme'
import { useProfileStore } from '~/stores/profile'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import SpotifyPlayer from '~/components/atoms/SpotifyPlayer.vue'
import ChallengeBrowser from '~/components/atoms/ChallengeBrowser.vue'
import PiPWindow from '~/components/atoms/PiPWindow.vue'
import Profile from '~/components/molecules/Profile.vue'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'
import Card from '~/components/organisms/Card.vue'
import { scrollToElement, getRandomNumber, playAudio, sendNotification } from '~/utils'

const { t } = useI18n()
useHead({ title: 'Pomodoro | Move.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()
const theme = useThemeStore()
const profile = useProfileStore()
const customInput = ref<number | null>(null)

onMounted(() => {
  theme.initTheme()
  challenges.initFromStorage()
  profile.loadFromStorage()
  countdown.initFromStorage()
  requestNotificationPermission()
})

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function setCountdownState(flag: boolean) {
  countdown.setHasCompleted(false)
  countdown.setIsActive(flag)
}

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

function getNewChallenge() {
  const index = getRandomNumber(0, challenges.challengesLength)
  countdown.setHasCompleted(true)
  challenges.setCurrentChallengeIndex(index)

  // Notificacao do navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    playAudio('/notification.mp3')
    const challenge = challenges.currentChallenge
    sendNotification(t('notifications.cycleCompleted'), {
      body: challenge ? challenge.description : t('notifications.newChallenge'),
      icon: '/favicon.png',
      tag: 'pomodoro-challenge',
    })
  }

  nextTick(() => scrollToElement('#challenge'))
}
</script>
