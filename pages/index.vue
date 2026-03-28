<template>
  <div class="py-6 lg:py-10">
    <!-- Linha principal: 3 colunas com altura padrao -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8" id="main-row">

      <!-- LEFT: Profile + Completed + Timer -->
      <div class="flex flex-col gap-4">
        <Profile />
        <CompletedChallenges />
        <TimerPresets class="flex-1" />
      </div>

      <!-- CENTER: Countdown + Button + Challenge -->
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

      <!-- RIGHT: Spotify -->
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
  if ('Notification' in window) Notification.requestPermission()
})

function setCountdownState(flag: boolean) {
  countdown.setHasCompleted(false)
  countdown.setIsActive(flag)
}

function getNewChallenge() {
  const index = getRandomNumber(0, challenges.challengesLength)
  countdown.setHasCompleted(true)
  challenges.setCurrentChallengeIndex(index)
  if (Notification?.permission === 'granted') {
    playAudio('/notification.mp3')
    sendNotification('Novo Challenge!', {
      body: 'Um novo challenge comecou. Va completar!',
      icon: '/favicon.png',
    })
  }
  nextTick(() => scrollToElement('#challenge'))
}
</script>
