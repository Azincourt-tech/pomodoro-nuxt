<template>
  <section class="flex flex-col lg:flex-row flex-1 lg:flex-none lg:mt-16 sm:gap-x-10 md:gap-x-20">
    <div class="flex flex-col w-full lg:w-1/2">
      <Profile />
      <CompletedChallenges />
      <Countdown @completed="getNewChallenge" />
      <button
        v-if="countdown.hasCountdownCompleted"
        disabled
        class="button completed"
      >
        Cycle completed
      </button>
      <button
        v-else-if="countdown.isCountdownActive"
        class="button abandon"
        @click="setCountdownState(false)"
      >
        Abandon cycle
      </button>
      <button
        v-else
        class="button start"
        @click="setCountdownState(true)"
      >
        Start a cycle
      </button>
      <SpotifyEmbed />
    </div>
    <Card id="challenge" class="w-full lg:w-1/2" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import Profile from '~/components/molecules/Profile.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import Card from '~/components/organisms/Card.vue'
import SpotifyEmbed from '~/components/atoms/SpotifyEmbed.vue'
import {
  scrollToElement,
  getRandomNumber,
  playAudio,
  sendNotification,
} from '~/utils'

useHead({ title: 'Home | movue.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()

onMounted(() => {
  challenges.initFromCookie()
  if ('Notification' in window) {
    Notification.requestPermission()
  }
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
      body: 'A new challenge has started! Go complete it!',
      icon: '/favicon.png',
    })
  }
  nextTick(() => {
    scrollToElement('#challenge')
  })
}
</script>
