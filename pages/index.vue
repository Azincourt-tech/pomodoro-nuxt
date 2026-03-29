<template>
  <div class="py-6 lg:py-10">
    <!-- PiP Window com botao -->
    <PiPWindow />

    <!-- Linha principal: 3 colunas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8" id="main-row">

      <!-- LEFT -->
      <div class="flex flex-col gap-4">
        <Profile />
        <CompletedChallenges />
        <TimerPresets class="flex-1" />
      </div>

      <!-- CENTER -->
      <div class="flex flex-col items-center gap-6">
        <div class="w-full flex flex-col items-center">
          <Countdown @completed="getNewChallenge" />

          <div class="mt-6 w-full max-w-sm">
            <button
              v-if="countdown.hasCompleted"
              disabled
              class="btn btn-disabled btn-block h-14 text-base font-semibold rounded-xl"
            >
              Ciclo completado
            </button>
            <button
              v-else-if="countdown.isActive"
              class="btn btn-error btn-outline btn-block h-14 text-base font-semibold rounded-xl"
              @click="setCountdownState(false)"
            >
              Abandonar ciclo
            </button>
            <button
              v-else
              class="btn btn-primary btn-block h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
              @click="setCountdownState(true)"
            >
              Iniciar ciclo
            </button>
          </div>
        </div>

        <div class="w-full flex-1">
          <Card id="challenge" />
        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex flex-col">
        <SpotifyPlayer class="flex-1" />
      </div>
    </div>

    <!-- Challenges Browser -->
    <div class="mt-8">
      <ChallengeBrowser />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useThemeStore } from '~/stores/theme'
import { useProfileStore } from '~/stores/profile'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import TimerPresets from '~/components/atoms/TimerPresets.vue'
import SpotifyPlayer from '~/components/atoms/SpotifyPlayer.vue'
import ChallengeBrowser from '~/components/atoms/ChallengeBrowser.vue'
import PiPWindow from '~/components/atoms/PiPWindow.vue'
import Profile from '~/components/molecules/Profile.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import Card from '~/components/organisms/Card.vue'
import { scrollToElement, getRandomNumber, playAudio, sendNotification } from '~/utils'

useHead({ title: 'Pomodoro | Move.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()
const theme = useThemeStore()
const profile = useProfileStore()

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

function getNewChallenge() {
  const index = getRandomNumber(0, challenges.challengesLength)
  countdown.setHasCompleted(true)
  challenges.setCurrentChallengeIndex(index)

  // Notificacao do navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    playAudio('/notification.mp3')
    const challenge = challenges.currentChallenge
    sendNotification('Ciclo completado!', {
      body: challenge ? challenge.description : 'Novo desafio disponivel!',
      icon: '/favicon.png',
      tag: 'pomodoro-challenge',
    })
  }

  nextTick(() => scrollToElement('#challenge'))
}
</script>
