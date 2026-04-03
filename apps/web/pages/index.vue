<template>
  <div class="py-6 lg:py-10" :class="{ 'focus-mode-active': isFocusMode }">
    <!-- Focus Mode Exit Button -->
    <div
      v-if="isFocusMode"
      class="fixed top-4 right-4 z-50"
    >
      <button
        class="btn btn-ghost btn-sm gap-2"
        @click="exitFocusMode"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        {{ $t('focusMode.exit') }}
      </button>
    </div>

    <!-- PiP Window com botao -->
    <PiPWindow />

    <!-- Linha principal: 3 colunas -->
    <div
      id="main-row"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      <!-- LEFT — CompletedChallenges + TimerPresets only (Profile moved to navbar dropdown) -->
      <div class="flex flex-col gap-4">
        <CompletedChallenges />
        <TimerPresets class="flex-1" />
      </div>

      <!-- CENTER -->
      <div class="flex flex-col items-center gap-6">
        <div class="w-full flex flex-col items-center">
          <Countdown @start="setCountdownState(true)" @pause="setCountdownState(false)" @completed="getNewChallenge" />

          <!-- Share button after completion -->
          <div
            v-if="countdown.hasCompleted"
            class="mt-4 w-full max-w-sm"
          >
            <button
              class="btn btn-outline btn-block h-12 text-base font-semibold rounded-xl"
              @click="showShareCard"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {{ $t('share.button') }}
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

    <!-- Share Card Modal (used by both navbar and post-completion button) -->
    <ShareCard
      ref="shareCardRef"
      :stats="shareStats"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useThemeStore } from '~/stores/theme'
import { useProfileStore } from '~/stores/profile'
import { useHistoryStore, type SessionRecord } from '~/stores/history'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { useSound } from '~/composables/useSound'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import TimerPresets from '~/components/atoms/TimerPresets.vue'
import SpotifyPlayer from '~/components/atoms/SpotifyPlayer.vue'
import ChallengeBrowser from '~/components/atoms/ChallengeBrowser.vue'
import PiPWindow from '~/components/atoms/PiPWindow.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import Card from '~/components/organisms/Card.vue'
import ShareCard from '~/components/molecules/ShareCard.vue'
import { scrollToElement, getRandomNumber, sendNotification } from '~/utils'

const { t } = useI18n()
useHead({ title: 'Pomodoro | Move.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()
const theme = useThemeStore()
const profile = useProfileStore()
const history = useHistoryStore()
const { playStart, playPause, playComplete } = useSound()

const shareCardRef = ref<InstanceType<typeof ShareCard> | null>(null)
const isFocusMode = ref(false)
const sessionStartTime = ref<number | null>(null)

const shareStats = computed(() => ({
  level: challenges.level,
  xp: challenges.xp.current,
  completedChallenges: challenges.completedChallenges,
  streakCurrent: profile.streakCurrent,
  streakBest: profile.streakBest,
  totalSessions: history.totalSessions,
  totalTime: history.totalTimeMinutes,
  userName: profile.displayName,
}))

onMounted(() => {
  theme.initTheme()
  challenges.initFromStorage()
  profile.loadFromStorage()
  countdown.initFromStorage()
  history.loadFromStorage()
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
  if (flag) {
    sessionStartTime.value = Date.now()
    playStart()
  } else {
    playPause()
  }
}

function getNewChallenge() {
  const index = getRandomNumber(0, challenges.challengesLength)
  countdown.setHasCompleted(true)
  challenges.setCurrentChallengeIndex(index)

  const challenge = challenges.currentChallenge
  const xpGained = challenge?.amount ?? 0

  // Complete challenge for XP
  if (challenge) {
    challenges.completeChallenge(xpGained)
  }

  // Save session to history
  const session: SessionRecord = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    startedAt: sessionStartTime.value ?? Date.now(),
    duration: countdown.customMinutes,
    challengeCompleted: challenge?.description ?? null,
    xpGained,
  }
  history.addSession(session)

  // Update streak
  profile.updateStreak()

  // Save progress
  profile.saveProgressToStorage(challenges.level, challenges.xp, challenges.completedChallenges)

  playComplete()

  // Vibrate on mobile
  if (navigator.vibrate) {
    navigator.vibrate([200])
  }

  // Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    sendNotification(t('notifications.cycleCompleted'), {
      body: challenge ? challenge.description : t('notifications.newChallenge'),
      icon: '/favicon.png',
      tag: 'pomodoro-challenge',
    })
  }

  nextTick(() => scrollToElement('#challenge'))
}

function showShareCard() {
  shareCardRef.value?.open()
}

function exitFocusMode() {
  isFocusMode.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
}

function toggleFocusMode() {
  isFocusMode.value = !isFocusMode.value
  if (isFocusMode.value) {
    document.documentElement.requestFullscreen?.().catch(() => {})
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }
}

// Keyboard shortcuts — shortcuts modal opened via layout navbar button
useKeyboardShortcuts({
  onTogglePlay: () => {
    if (countdown.hasCompleted) return
    setCountdownState(!countdown.isActive)
  },
  onReset: () => {
    countdown.setIsActive(false)
    countdown.setHasCompleted(false)
    countdown.resetTime()
  },
  onNextChallenge: () => {
    const index = getRandomNumber(0, challenges.challengesLength)
    challenges.setCurrentChallengeIndex(index)
    nextTick(() => scrollToElement('#challenge'))
  },
  onFocusMode: toggleFocusMode,
  onShowHelp: () => {
    // Shortcuts modal is now opened from the navbar `?` button
    // This is kept for keyboard shortcut compatibility
  },
})

// Handle ESC to exit focus mode
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFocusMode.value) {
      exitFocusMode()
    }
  })
})
</script>

<style scoped>
.focus-mode-active .focus-hidden {
  display: none;
}
</style>
