<template>
  <div class="min-h-screen bg-base-200 py-6 lg:py-10" :class="{ 'focus-mode-active': isFocusMode }">
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

    <!-- PiP Window -->
    <PiPWindow />

    <!-- Linha principal: 3 colunas -->
    <div
      id="main-row"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      <!-- LEFT — CompletedChallenges + TimerPresets -->
      <div class="flex flex-col gap-4">
        <CompletedChallenges />
        <TimerPresets class="flex-1" />
      </div>

      <!-- CENTER -->
      <div class="flex flex-col items-center gap-6">
        <div class="w-full flex flex-col items-center">
          <div class="p-4">
            <Countdown @completed="getNewChallenge" />
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-3 mt-4">
            <!-- During break - show "Start Next Cycle" button -->
            <template v-if="countdown.isBreak">
              <button
                class="btn btn-success btn-md gap-2 px-10 py-3.5 shadow-lg shadow-success/20 hover:shadow-success/40 hover:-translate-y-0.5 transition-all duration-300 text-lg"
                @click="startNextCycle"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {{ countdown.isLongBreak ? $t('timer.startAfterLongBreak', 'Iniciar Próximo Ciclo') : $t('timer.startAfterBreak', 'Iniciar Próximo Ciclo') }}
              </button>
            </template>
            <!-- Cycle completed - show disabled message -->
            <button
              v-else-if="countdown.hasCompleted"
              disabled
              class="btn btn-disabled btn-md px-8"
            >
              {{ $t('timer.cycleCompleted') }}
            </button>
            <!-- Not active - show start button -->
            <template v-else-if="!countdown.isActive">
              <button
                class="btn btn-primary btn-md gap-2 px-10 py-3.5 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 text-lg"
                @click="setCountdownState(true)"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {{ $t('timer.startCycle') }}
              </button>
            </template>
            <!-- Active - show pause button -->
            <template v-else>
              <button
                class="btn btn-error btn-outline btn-md gap-2 px-10 py-3.5 hover:shadow-md transition-all duration-200"
                @click="setCountdownState(false)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ $t('timer.pauseCycle') }}
              </button>
            </template>
          </div>

          <!-- Share button after completion -->
          <div
            v-if="countdown.hasCompleted"
            class="mt-4 w-full max-w-sm"
          >
            <button
              class="btn btn-outline btn-block h-12 text-base font-semibold rounded-xl overflow-visible"
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
      </div>

      <!-- RIGHT -->
      <div class="flex flex-col">
        <SpotifyPlayer class="flex-1" />
      </div>
    </div>

    <!-- Challenges Browser + Challenge History -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChallengeBrowser />
      <ChallengeHistory />
    </div>

    <!-- Modals -->
    <ChallengeModal
      :challenge="challenges.currentChallenge"
      :is-open="isChallengeModalOpen"
      @close="isChallengeModalOpen = false"
      @complete="isChallengeModalOpen = false"
    />
    <LevelUpModal />
    <ShareCard
      ref="shareCardRef"
      :stats="shareStats"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed, watch } from 'vue'
import { useChallengesStore } from '~/stores/challenges'
import { useCountdownStore } from '~/stores/countdown'
import { useThemeStore } from '~/stores/theme'
import { useProfileStore } from '~/stores/profile'
import { useHistoryStore, type SessionRecord } from '~/stores/history'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { useSound } from '~/composables/useSound'
import { useToast } from '~/composables/useToast'
import CompletedChallenges from '~/components/atoms/CompletedChallenges.vue'
import TimerPresets from '~/components/atoms/TimerPresets.vue'
import SpotifyPlayer from '~/components/atoms/SpotifyPlayer.vue'
import ChallengeBrowser from '~/components/atoms/ChallengeBrowser.vue'
import ChallengeHistory from '~/components/atoms/ChallengeHistory.vue'
import PiPWindow from '~/components/atoms/PiPWindow.vue'
import Countdown from '~/components/molecules/Countdown.vue'
import ShareCard from '~/components/molecules/ShareCard.vue'
import ChallengeModal from '~/components/atoms/ChallengeModal.vue'
import LevelUpModal from '~/components/atoms/LevelUpModal.vue'
import { scrollToElement, getRandomNumber, sendNotification } from '~/utils'

const { t } = useI18n()
useHead({ title: 'Pomodoro | Move.it' })

const challenges = useChallengesStore()
const countdown = useCountdownStore()
const theme = useThemeStore()
const profile = useProfileStore()
const history = useHistoryStore()
const { playStart, playPause, playComplete, playBreakEnd } = useSound()
const { success, info } = useToast()

const shareCardRef = ref<InstanceType<typeof ShareCard> | null>(null)
const isFocusMode = ref(false)
const sessionStartTime = ref<number | null>(null)
const isChallengeModalOpen = ref(false)

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
    success(t('timer.cycleStarted', 'Ciclo iniciado! Foco total! 🎯'))
  } else {
    playPause()
    info(t('timer.cyclePaused', 'Ciclo pausado'))
  }
}

function getNewChallenge() {
  // Check if we're ending a break
  if (countdown.isBreak) {
    // Break ended - play specific sound and return to focus mode
    playBreakEnd()
    
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300])
    }
    
    if ('Notification' in window && Notification.permission === 'granted') {
      sendNotification(t('notifications.breakEnded', 'Pausa terminada!'), {
        body: t('notifications.breakEndedDesc', 'Hora de voltar ao foco! Inicie um novo ciclo.'),
        icon: '/favicon.png',
        tag: 'pomodoro-break-ended',
      })
    }
    return
  }
  
  // Focus cycle ended - show challenge modal
  const index = getRandomNumber(0, challenges.challengesLength)
  challenges.setCurrentChallengeIndex(index)
  isChallengeModalOpen.value = true
  
  // Vibration and sound
  playComplete()
  if (navigator.vibrate) {
    navigator.vibrate([200])
  }
  
  // Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    sendNotification(t('notifications.challenge', 'Novo Desafio!'), {
      body: t('notifications.challengeDesc', 'Complete o desafio para ganhar XP!'),
      icon: '/favicon.png',
      tag: 'pomodoro-challenge',
    })
  }
}

function startNextCycle() {
  // Exit break mode and start next pomodoro
  countdown.setBreakMode(false, false)
  countdown.setHasCompleted(false)
  
  // NAO mostrar modal de desafio - ele já foi mostrado quando o ciclo anterior terminou
  // NAO dar XP novamente - XP já foi dado ao completar o desafio anterior
  
  playStart()
  countdown.setIsActive(true)
  
  sessionStartTime.value = Date.now()
  
  success(t('timer.nextCycleStarted', 'Próximo ciclo iniciado! Vamos lá! 💪'))
}

function showShareCard() {
  shareCardRef.value?.open()
  info(t('share.opened', 'Card de compartilhamento aberto'))
}

function exitFocusMode() {
  isFocusMode.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
  info(t('focusMode.exited', 'Modo foco desativado'))
}

function toggleFocusMode() {
  isFocusMode.value = !isFocusMode.value
  if (isFocusMode.value) {
    document.documentElement.requestFullscreen?.().catch(() => {})
    success(t('focusMode.entered', 'Modo foco ativado! Foco total! 🎯'))
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
    info(t('focusMode.exited', 'Modo foco desativado'))
  }
}

// Abre a modal quando um novo desafio é definido (via timer ou atalho 'n')
watch(
  () => challenges.currentChallenge,
  (newChallenge) => {
    if (newChallenge !== null) {
      isChallengeModalOpen.value = true
    }
  }
)

// Keyboard shortcuts
useKeyboardShortcuts({
  onTogglePlay: () => {
    if (countdown.hasCompleted) return
    setCountdownState(!countdown.isActive)
  },
  onReset: () => {
    countdown.setIsActive(false)
    countdown.setHasCompleted(false)
    countdown.resetTime()
    info(t('shortcuts.timerReseted', 'Timer resetado (atalho R)'))
  },
  onNextChallenge: () => {
    const index = getRandomNumber(0, challenges.challengesLength)
    challenges.setCurrentChallengeIndex(index)
    const challenge = challenges.currentChallenge
    if (challenge) {
      info(t('shortcuts.newChallenge', 'Novo desafio: {desc}', { desc: challenge.description }))
    }
  },
  onFocusMode: toggleFocusMode,
  onShowHelp: () => {
    info(t('shortcuts.help', 'Atalhos: Espaco (play/pause), R (reset), N (proximo desafio), F (foco), ? (ajuda)'))
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