<template>
  <div class="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-6 lg:mt-10">
    <!-- Left Column -->
    <div class="flex flex-col w-full lg:w-1/2 gap-4">
      <Profile />
      <CompletedChallenges />
      <Countdown @completed="getNewChallenge" />

      <div class="mt-2">
        <button
          v-if="countdown.hasCompleted"
          disabled
          class="btn btn-disabled btn-block h-14 text-base font-semibold"
        >
          Cycle completed
        </button>
        <button
          v-else-if="countdown.isActive"
          class="btn btn-error btn-outline btn-block h-14 text-base font-semibold"
          @click="setCountdownState(false)"
        >
          Abandon cycle
        </button>
        <button
          v-else
          class="btn btn-primary btn-block h-14 text-base font-semibold"
          @click="setCountdownState(true)"
        >
          Start a cycle
        </button>
      </div>

      <SpotifyEmbed />
    </div>

    <!-- Right Column -->
    <Card id="challenge" class="w-full lg:w-1/2" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useThemeStore } from '~/stores/theme'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import Profile from '~/components/molecules/Profile.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import Card from '~/components/organisms/Card.vue'
import SpotifyEmbed from '~/components/atoms/SpotifyEmbed.vue'
import { scrollToElement, getRandomNumber, playAudio, sendNotification } from '~/utils'

useHead({ title: 'Pomodoro | Move.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()
const theme = useThemeStore()

onMounted(() => {
  theme.initTheme()
  challenges.initFromCookie()
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
    sendNotification('New Challenge!', {
      body: 'A new challenge has started. Go complete it!',
      icon: '/favicon.png',
    })
  }
  nextTick(() => scrollToElement('#challenge'))
}
</script>
