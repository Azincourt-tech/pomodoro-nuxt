<template>
  <!-- PiP Toggle Button -->
  <button
    class="btn btn-circle btn-primary shadow-lg fixed bottom-4 right-4 z-[9998]"
    @click="togglePiP"
    :title="pipStore.isOpen ? 'Fechar janela flutuante' : 'Abrir janela flutuante'"
  >
    <svg v-if="!pipStore.isOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import { useChallengesStore } from '~/stores/challenges'
import { usePipStore } from '~/stores/pip'

const countdown = useCountdownStore()
const challenges = useChallengesStore()
const pipStore = usePipStore()

let pipWindow: Window | null = null

async function togglePiP() {
  if (pipStore.isOpen) {
    closePiP()
  } else {
    await openPiP()
  }
}

async function openPiP() {
  // Verificar se Document PiP API esta disponivel
  if (!('documentPictureInPicture' in window)) {
    // Fallback: abrir em nova janela
    openFallbackWindow()
    return
  }

  try {
    // @ts-ignore - Document PiP API
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 320,
      height: 280,
    })

    // Copiar estilos
    const allStyles = document.querySelectorAll('link[rel="stylesheet"], style')
    for (const style of allStyles) {
      pipWindow.document.head.appendChild(style.cloneNode(true))
    }

    // Injetar o conteudo do timer
    pipWindow.document.body.innerHTML = `
      <div id="pip-container" style="
        font-family: 'Inter', sans-serif;
        background: oklch(var(--b1, 0.21 0.006 286));
        color: oklch(var(--bc, 0.98 0 0));
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 16px;
        box-sizing: border-box;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: oklch(var(--p, 0.65 0.25 280))">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style="font-weight: 600; font-size: 14px;">Pomodoro</span>
        </div>
        <div id="pip-timer" style="
          text-align: center;
          font-family: 'Rajdhani', sans-serif;
          font-size: 64px;
          font-weight: 700;
          margin-bottom: 8px;
        ">25:00</div>
        <div id="pip-status" style="text-align: center; font-size: 12px; opacity: 0.6; margin-bottom: 12px;">Pausado</div>
        <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
          <button id="pip-toggle-btn" onclick="window.opener?.postMessage({type: 'pip-toggle'}, '*')" style="
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            background: oklch(var(--p, 0.65 0.25 280));
            color: white;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
          ">Iniciar</button>
          <button onclick="window.opener?.postMessage({type: 'pip-reset'}, '*')" style="
            padding: 8px 16px;
            border-radius: 8px;
            border: 1px solid oklch(var(--bc, 0.98 0 0) / 0.2);
            background: transparent;
            cursor: pointer;
            font-size: 14px;
          ">Reset</button>
        </div>
        <div id="pip-challenge" style="
          background: oklch(var(--b2, 0.27 0.006 286));
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
        ">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-weight: 600;">Desafio</span>
          </div>
          <p id="pip-challenge-text" style="opacity: 0.7; line-height: 1.4;">Inicie um ciclo para receber desafios</p>
        </div>
      </div>
    `

    // Escutar mensagens da janela PiP
    pipWindow.addEventListener('message', handlePiPMessage)

    // Atualizar o timer na janela PiP
    watchPiP()

    pipStore.open()

    // Quando a janela fechar
    pipWindow.addEventListener('pagehide', () => {
      pipStore.close()
      pipWindow = null
    })

  } catch (err) {
    console.error('Erro ao abrir PiP:', err)
    openFallbackWindow()
  }
}

function openFallbackWindow() {
  pipWindow = window.open(
    '',
    'pomodoro-pip',
    'width=320,height=280,resizable=yes,scrollbars=no'
  )

  if (!pipWindow) return

  pipWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pomodoro</title>
      <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 16px; background: #1a1a2e; color: #e8e6e3; min-height: 100vh; display: flex; flex-direction: column; }
        .timer { text-align: center; font-family: 'Rajdhani', sans-serif; font-size: 64px; font-weight: 700; margin-bottom: 8px; }
        .status { text-align: center; font-size: 12px; opacity: 0.6; margin-bottom: 12px; }
        .controls { display: flex; gap: 8px; justify-content: center; margin-bottom: 12px; }
        .btn { padding: 8px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #6366f1; color: white; }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: inherit; }
        .challenge { background: #252540; border-radius: 8px; padding: 12px; font-size: 12px; }
        .challenge-title { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 600; }
        .challenge-text { opacity: 0.7; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span style="font-weight: 600; font-size: 14px;">Pomodoro</span>
      </div>
      <div class="timer" id="pip-timer">25:00</div>
      <div class="status" id="pip-status">Pausado</div>
      <div class="controls">
        <button class="btn btn-primary" id="pip-toggle-btn">Iniciar</button>
        <button class="btn btn-ghost" id="pip-reset-btn">Reset</button>
      </div>
      <div class="challenge">
        <div class="challenge-title">Desafio</div>
        <p class="challenge-text" id="pip-challenge-text">Inicie um ciclo para receber desafios</p>
      </div>
    </body>
    </html>
  `)

  pipWindow.document.close()

  // Adicionar event listeners
  pipWindow.document.getElementById('pip-toggle-btn')?.addEventListener('click', () => {
    window.postMessage({ type: 'pip-toggle' }, '*')
  })

  pipWindow.document.getElementById('pip-reset-btn')?.addEventListener('click', () => {
    window.postMessage({ type: 'pip-reset' }, '*')
  })

  // Atualizar timer
  watchPiP()

  pipStore.open()

  pipWindow.addEventListener('beforeunload', () => {
    pipStore.close()
    pipWindow = null
  })
}

function closePiP() {
  if (pipWindow) {
    pipWindow.close()
    pipWindow = null
  }
  pipStore.close()
}

function handlePiPMessage(event: MessageEvent) {
  if (event.data?.type === 'pip-toggle') {
    countdown.setIsActive(!countdown.isActive)
    if (!countdown.isActive) {
      countdown.setHasCompleted(false)
    }
  } else if (event.data?.type === 'pip-reset') {
    countdown.setIsActive(false)
    countdown.setHasCompleted(false)
    countdown.resetTime()
  }
}

function watchPiP() {
  const updateTimer = () => {
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
    }

    if (toggleBtn) {
      toggleBtn.textContent = countdown.isActive ? 'Parar' : 'Iniciar'
      toggleBtn.style.background = countdown.isActive ? '#ef4444' : '#6366f1'
    }

    if (challengeText) {
      challengeText.textContent = challenges.currentChallenge
        ? challenges.currentChallenge.description
        : 'Inicie um ciclo para receber desafios'
    }

    requestAnimationFrame(updateTimer)
  }

  requestAnimationFrame(updateTimer)
}

// Escutar mensagens da janela PiP
window.addEventListener('message', handlePiPMessage)
</script>
