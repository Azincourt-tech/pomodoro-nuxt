import { ref } from 'vue'

const soundEnabled = ref(true)

/**
 * Web Audio API synth-based sound effects.
 * Each action has a distinct audio signature:
 *  - start: short ascending arpeggio (motivational "let's go!")
 *  - pause: single soft descending tone (gentle "break")
 *  - complete: triumphant 3-note major chord (celebratory)
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  catch {
    return null
  }
}

/** Play a sequence of notes with configurable waveform, durations and volumes */
function playSequence(
  notes: Array<{ freq: number, start: number, duration: number, gain?: number }>,
  type: OscillatorType = 'sine',
) {
  const ctx = getAudioContext()
  if (!ctx) return

  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.3
  masterGain.connect(ctx.destination)

  for (const note of notes) {
    const osc = ctx.createOscillator()
    const noteGain = ctx.createGain()
    osc.type = type
    osc.frequency.value = note.freq
    noteGain.gain.value = note.gain ?? 0.5
    // Envelope: quick attack, smooth release
    noteGain.gain.setValueAtTime(0, ctx.currentTime + note.start)
    noteGain.gain.linearRampToValueAtTime(note.gain ?? 0.5, ctx.currentTime + note.start + 0.02)
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.start + note.duration)
    osc.connect(noteGain)
    noteGain.connect(masterGain)
    osc.start(ctx.currentTime + note.start)
    osc.stop(ctx.currentTime + note.start + note.duration)
  }
}

/** "Let's go!" - quick ascending arpeggio (C5 -> E5 -> G5) */
function playStartSound() {
  playSequence([
    { freq: 523.25, start: 0, duration: 0.15 },
    { freq: 659.25, start: 0.1, duration: 0.15 },
    { freq: 783.99, start: 0.2, duration: 0.2 },
  ], 'triangle')
}

/** "Pause" - gentle descending tone (G4 -> E4) */
function playPauseSound() {
  playSequence([
    { freq: 392.00, start: 0, duration: 0.2 },
    { freq: 329.63, start: 0.15, duration: 0.3 },
  ], 'sine')
}

/** "Complete!" - celebratory major chord (C5 -> E5 -> G5 -> C6) with sparkle */
function playCompleteSound() {
  playSequence([
    { freq: 523.25, start: 0, duration: 0.25 },
    { freq: 659.25, start: 0.08, duration: 0.25 },
    { freq: 783.99, start: 0.16, duration: 0.25 },
    { freq: 1046.50, start: 0.24, duration: 0.5 },
  ], 'triangle')
}

/** "Break Over!" - energizing alert sound (A4 -> C5 -> E5) to signal return to work */
function playBreakEndSound() {
  playSequence([
    { freq: 440.00, start: 0, duration: 0.15 },
    { freq: 523.25, start: 0.12, duration: 0.15 },
    { freq: 659.25, start: 0.24, duration: 0.3 },
  ], 'square')
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

  function playStart() {
    if (!soundEnabled.value) return
    if (typeof window === 'undefined') return
    playStartSound()
  }

  function playPause() {
    if (!soundEnabled.value) return
    if (typeof window === 'undefined') return
    playPauseSound()
  }

  function playComplete() {
    if (!soundEnabled.value) return
    if (typeof window === 'undefined') return
    playCompleteSound()
  }

  function playBreakEnd() {
    if (!soundEnabled.value) return
    if (typeof window === 'undefined') return
    playBreakEndSound()
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
    playBreakEnd,
    vibrate,
  }
}
