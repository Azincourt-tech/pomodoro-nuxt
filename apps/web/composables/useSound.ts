import { ref } from 'vue'

const soundEnabled = ref(true)

const sounds = {
  start: null as HTMLAudioElement | null,
  pause: null as HTMLAudioElement | null,
  complete: null as HTMLAudioElement | null,
}

function getAudio(path: string): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  return new Audio(path)
}

export function useSound() {
  function initFromStorage() {
    if (import.meta.client) {
      const saved = localStorage.getItem('pomodoro-sound-enabled')
      if (saved !== null) {
        soundEnabled.value = saved === 'true'
      }
    }
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    if (import.meta.client) {
      localStorage.setItem('pomodoro-sound-enabled', String(soundEnabled.value))
    }
  }

  function playSound(path: string) {
    if (!soundEnabled.value) return
    if (typeof window === 'undefined') return
    try {
      const audio = getAudio(path)
      if (audio) {
        audio.volume = 0.5
        audio.play().catch(() => {})
      }
    }
    catch {
      // ignore audio errors
    }
  }

  function playStart() {
    playSound('/sounds/start.mp3')
  }

  function playPause() {
    playSound('/sounds/pause.mp3')
  }

  function playComplete() {
    playSound('/sounds/complete.mp3')
  }

  function vibrate(pattern: number[] = [200]) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  return {
    soundEnabled,
    initFromStorage,
    toggleSound,
    playStart,
    playPause,
    playComplete,
    vibrate,
  }
}
