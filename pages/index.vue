<template>
  <div class="py-6 lg:py-10">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">

      <!-- LEFT SIDEBAR -->
      <aside class="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <div class="flex flex-col gap-4">
          <Profile />
          <CompletedChallenges />
          <TimerPresets class="flex-1" />
        </div>
      </aside>

      <!-- CENTER -->
      <div class="flex-1 flex flex-col items-center gap-6 min-w-0">
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

        <div class="w-full max-w-lg">
          <Card id="challenge" />
        </div>
      </div>

      <!-- RIGHT SIDEBAR -->
      <aside class="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <SpotifyPlayer />
      </aside>
    </div>

    <div class="mt-8 lg:mt-12">
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
