<template>
  <!-- PiP Toggle Button -->
  <button
    class="btn btn-circle btn-primary shadow-lg fixed bottom-4 right-4 z-[9998]"
    @click="togglePiP"
    :title="isOpen ? 'Fechar janela flutuante' : 'Abrir janela flutuante'"
  >
    <svg v-if="!isOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import { useChallengesStore } from '~/stores/challenges'

const countdown = useCountdownStore()
const challenges = useChallengesStore()
const isOpen = ref(false)

let pipWindow: any = null
let animFrameId: number | null = null

function togglePiP() {
  if (isOpen.value) {
    closePiP()
  } else {
    openPiP()
  }
}

function openPiP() {
  if (!import.meta.client) return

  pipWindow = window.open('', 'pomodoro-pip', 'width=360,height=420,resizable=yes')

  if (!pipWindow || pipWindow.closed) {
    alert('Permita popups para usar a janela flutuante')
    return
  }

  pipWindow.document.write(getPiPHTML())
  pipWindow.document.close()

  // Event listeners
  pipWindow.document.getElementById('pip-toggle-btn')?.addEventListener('click', () => {
    countdown.setIsActive(!countdown.isActive)
    if (!countdown.isActive) countdown.setHasCompleted(false)
  })

  pipWindow.document.getElementById('pip-reset-btn')?.addEventListener('click', () => {
    countdown.setIsActive(false)
    countdown.setHasCompleted(false)
    countdown.resetTime()
  })

  // Update loop
  updatePiPLoop()
  isOpen.value = true

  pipWindow.addEventListener('beforeunload', () => {
    isOpen.value = false
    pipWindow = null
    if (animFrameId) cancelAnimationFrame(animFrameId)
  })
}

function closePiP() {
  if (pipWindow && !pipWindow.closed) pipWindow.close()
  pipWindow = null
  isOpen.value = false
  if (animFrameId) cancelAnimationFrame(animFrameId)
}

function updatePiPLoop() {
  if (!pipWindow || pipWindow.closed) return

  const timerEl = pipWindow.document.getElementById('pip-timer')
  const statusEl = pipWindow.document.getElementById('pip-status')
  const toggleBtn = pipWindow.document.getElementById('pip-toggle-btn')
  const challengeText = pipWindow.document.getElementById('pip-challenge-text')

  if (timerEl) {
    timerEl.textContent = `${countdown.minutes}:${String(countdown.seconds).padStart(2, '0')}`
  }

  if (statusEl) {
    statusEl.textContent = countdown.isActive ? 'Em andamento' : 'Pausado'
    statusEl.style.color = countdown.isActive ? '#22c55e' : '#9ca3af'
  }

  if (toggleBtn) {
    toggleBtn.textContent = countdown.isActive ? 'Parar' : 'Iniciar'
    const btn = toggleBtn as HTMLButtonElement
    btn.style.background = countdown.isActive ? '#ef4444' : '#6366f1'
  }

  if (challengeText) {
    challengeText.textContent = challenges.currentChallenge
      ? challenges.currentChallenge.description
      : 'Inicie um ciclo para receber desafios'
  }

  animFrameId = requestAnimationFrame(updatePiPLoop)
}

function getPiPHTML(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Pomodoro</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #0f0f1a;
      color: #e8e6e3;
      min-height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .timer-wrapper { text-align: center; margin-bottom: 8px; }
    .timer {
      font-family: 'Rajdhani', sans-serif;
      font-size: 80px;
      font-weight: 700;
      letter-spacing: 3px;
      line-height: 1;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .status { font-size: 12px; font-weight: 500; margin-top: 4px; color: #9ca3af; }

    .controls { display: flex; gap: 10px; justify-content: center; margin: 16px 0; }
    .btn {
      padding: 10px 24px;
      border-radius: 10px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .btn-primary { background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; }
    .btn-ghost {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #9ca3af;
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .challenge {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 14px;
      flex: 1;
    }
    .challenge-header {
      display: flex; align-items: center; gap: 6px;
      font-weight: 600; font-size: 12px;
      color: #a78bfa;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .challenge-text { font-size: 13px; color: #9ca3af; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="timer-wrapper">
    <div class="timer" id="pip-timer">${countdown.minutes}:${String(countdown.seconds).padStart(2, '0')}</div>
    <div class="status" id="pip-status">${countdown.isActive ? 'Em andamento' : 'Pausado'}</div>
  </div>

  <div class="controls">
    <button class="btn btn-primary" id="pip-toggle-btn">${countdown.isActive ? 'Parar' : 'Iniciar'}</button>
    <button class="btn btn-ghost" id="pip-reset-btn">Reset</button>
  </div>

  <div class="challenge">
    <div class="challenge-header">Desafio</div>
    <p class="challenge-text" id="pip-challenge-text">${challenges.currentChallenge ? challenges.currentChallenge.description : 'Inicie um ciclo para receber desafios'}</p>
  </div>
</body>
</html>`
}

onUnmounted(() => {
  closePiP()
})
</script>
