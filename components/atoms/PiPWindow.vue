<template>
  <!-- PiP Toggle Button -->
  <button
    class="btn btn-circle shadow-lg fixed bottom-4 right-4 z-[9998]"
    :class="isOpen ? 'btn-error' : 'btn-primary'"
    @click="togglePiP"
    :title="isOpen ? 'Fechar janela flutuante' : 'Abrir janela flutuante'"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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

async function openPiP() {
  if (!import.meta.client) return

  // Tenta Document PiP API primeiro (Chrome 116+, Edge)
  if ('documentPictureInPicture' in window) {
    try {
      // @ts-ignore
      pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 340,
        height: 380,
      })

      // Copiar estilos
      const styles = document.querySelectorAll('link[rel="stylesheet"], style')
      styles.forEach(style => pipWindow.document.head.appendChild(style.cloneNode(true)))

      // Injetar CSS customizado
      const customStyle = pipWindow.document.createElement('style')
      customStyle.textContent = getPiPCSS()
      pipWindow.document.head.appendChild(customStyle)

      // Injetar HTML
      pipWindow.document.body.innerHTML = getPiPBody()
      pipWindow.document.title = 'Pomodoro'

      // Configurar eventos
      setupPiPEvents()

      // Iniciar atualizacao
      updatePiPLoop()

      isOpen.value = true

      // Detectar fechamento
      pipWindow.addEventListener('pagehide', () => {
        isOpen.value = false
        pipWindow = null
        if (animFrameId) cancelAnimationFrame(animFrameId)
      })

      return
    } catch (err) {
      console.warn('Document PiP falhou, usando fallback:', err)
    }
  }

  // Fallback: window.open
  pipWindow = window.open('', 'pomodoro-pip', 'width=340,height=380')

  if (!pipWindow || pipWindow.closed) {
    alert('Permita popups para usar a janela flutuante')
    return
  }

  pipWindow.document.write(getFullHTML())
  pipWindow.document.close()

  setupPiPEvents()
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

function setupPiPEvents() {
  pipWindow?.document.getElementById('pip-toggle-btn')?.addEventListener('click', () => {
    countdown.setIsActive(!countdown.isActive)
    if (!countdown.isActive) countdown.setHasCompleted(false)
  })

  pipWindow?.document.getElementById('pip-reset-btn')?.addEventListener('click', () => {
    countdown.setIsActive(false)
    countdown.setHasCompleted(false)
    countdown.resetTime()
  })
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
    btn.style.background = countdown.isActive
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : 'linear-gradient(135deg, #6366f1, #7c3aed)'
  }

  if (challengeText) {
    challengeText.textContent = challenges.currentChallenge
      ? challenges.currentChallenge.description
      : 'Inicie um ciclo para receber desafios'
  }

  animFrameId = requestAnimationFrame(updatePiPLoop)
}

function getPiPCSS(): string {
  return `
    body {
      font-family: 'Inter', -apple-system, sans-serif !important;
      background: #0f0f1a !important;
      color: #e8e6e3 !important;
      margin: 0 !important;
      padding: 20px !important;
      display: flex !important;
      flex-direction: column !important;
      min-height: 100vh !important;
    }
  `
}

function getPiPBody(): string {
  return `
    <div class="pip-timer-wrapper">
      <div class="pip-timer" id="pip-timer">${countdown.minutes}:${String(countdown.seconds).padStart(2, '0')}</div>
      <div class="pip-status" id="pip-status">${countdown.isActive ? 'Em andamento' : 'Pausado'}</div>
    </div>
    <div class="pip-controls">
      <button class="pip-btn pip-btn-primary" id="pip-toggle-btn">${countdown.isActive ? 'Parar' : 'Iniciar'}</button>
      <button class="pip-btn pip-btn-ghost" id="pip-reset-btn">Reset</button>
    </div>
    <div class="pip-challenge">
      <div class="pip-challenge-header">Desafio</div>
      <p class="pip-challenge-text" id="pip-challenge-text">${challenges.currentChallenge ? challenges.currentChallenge.description : 'Inicie um ciclo para receber desafios'}</p>
    </div>
    <style>${getPiPStyles()}</style>
  `
}

function getPiPStyles(): string {
  return `
    .pip-timer-wrapper { text-align: center; margin-bottom: 12px; }
    .pip-timer {
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
    .pip-status { font-size: 13px; font-weight: 500; margin-top: 6px; color: #9ca3af; }
    .pip-controls { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
    .pip-btn {
      padding: 12px 28px;
      border-radius: 12px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 15px;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }
    .pip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
    .pip-btn-primary { background: linear-gradient(135deg, #6366f1, #7c3aed); color: white; }
    .pip-btn-ghost {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #9ca3af;
    }
    .pip-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .pip-challenge {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 14px;
      padding: 16px;
      flex: 1;
    }
    .pip-challenge-header {
      font-weight: 600; font-size: 11px;
      color: #a78bfa;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .pip-challenge-text { font-size: 14px; color: #9ca3af; line-height: 1.6; }
  `
}

function getFullHTML(): string {
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
    ${getPiPStyles()}
  </style>
</head>
<body>
  ${getPiPBody()}
</body>
</html>`
}

onUnmounted(() => {
  closePiP()
})
</script>
