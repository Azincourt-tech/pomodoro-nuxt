<template>
  <!-- PiP Toggle Button -->
  <button
    class="btn btn-circle shadow-lg fixed bottom-4 right-4 z-[9998]"
    :class="isOpen ? 'btn-error' : 'btn-primary'"
    @click="togglePiP"
    :title="isOpen ? $t('pip.closeWindow') : $t('pip.openWindow')"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import { useChallengesStore } from '~/stores/challenges'
import { useThemeStore } from '~/stores/theme'

const { t, locale } = useI18n()
const countdown = useCountdownStore()
const challenges = useChallengesStore()
const themeStore = useThemeStore()
const isOpen = ref(false)

let pipWindow: any = null
let animFrameId: number | null = null

// Watch for theme changes and update PiP
watch(() => themeStore.currentTheme, () => {
  if (isOpen.value && pipWindow) {
    updatePiPTheme()
  }
})

// Watch for locale changes and update PiP
watch(() => locale.value, () => {
  if (isOpen.value && pipWindow) {
    updatePiPContent()
  }
})

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

      // Injetar CSS customizado com tema DaisyUI
      const customStyle = pipWindow.document.createElement('style')
      customStyle.textContent = getPiPCSS()
      pipWindow.document.head.appendChild(customStyle)

      // Injetar HTML
      pipWindow.document.body.innerHTML = getPiPBody()
      pipWindow.document.title = 'Pomodoro'

      // Sincronizar tema DaisyUI
      syncDaisyUITheme()

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
    alert(t('pip.allowPopups'))
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
    statusEl.textContent = countdown.isActive ? t('pip.inProgress') : t('pip.paused')
  }

  if (toggleBtn) {
    toggleBtn.textContent = countdown.isActive ? t('pip.stop') : t('pip.start')
  }

  if (challengeText) {
    challengeText.textContent = challenges.currentChallenge
      ? challenges.currentChallenge.description
      : t('pip.startForChallenges')
  }

  animFrameId = requestAnimationFrame(updatePiPLoop)
}

function updatePiPContent() {
  if (!pipWindow || pipWindow.closed) return

  const challengeHeader = pipWindow.document.querySelector('.pip-challenge-header')
  if (challengeHeader) {
    challengeHeader.textContent = t('pip.challenge')
  }

  const statusEl = pipWindow.document.getElementById('pip-status')
  if (statusEl) {
    statusEl.textContent = countdown.isActive ? t('pip.inProgress') : t('pip.paused')
  }

  const toggleBtn = pipWindow.document.getElementById('pip-toggle-btn')
  if (toggleBtn) {
    toggleBtn.textContent = countdown.isActive ? t('pip.stop') : t('pip.start')
  }

  const resetBtn = pipWindow.document.getElementById('pip-reset-btn')
  if (resetBtn) {
    resetBtn.textContent = t('pip.reset')
  }

  const challengeText = pipWindow.document.getElementById('pip-challenge-text')
  if (challengeText && !challenges.currentChallenge) {
    challengeText.textContent = t('pip.startForChallenges')
  }
}

function syncDaisyUITheme() {
  if (!pipWindow || pipWindow.closed) return

  // Copy data-theme attribute
  const dataTheme = document.documentElement.getAttribute('data-theme')
  if (dataTheme) {
    pipWindow.document.documentElement.setAttribute('data-theme', dataTheme)
  }

  // Get computed CSS variables from the parent document
  const rootStyles = getComputedStyle(document.documentElement)

  // Extract DaisyUI theme colors
  const themeVars = [
    '--p', '--pc', '--s', '--sc', '--a', '--ac',
    '--n', '--nc', '--b1', '--b2', '--b3', '--bc',
    '--inc', '--suc', '--wa', '--er', '--in',
    '--su', '--wa', '--er',
  ]

  let cssVars = ''
  for (const varName of themeVars) {
    const value = rootStyles.getPropertyValue(varName).trim()
    if (value) {
      cssVars += `${varName}: ${value};\n`
    }
  }

  // Update or create style element with theme variables
  let themeStyleEl = pipWindow.document.getElementById('pip-theme-vars')
  if (!themeStyleEl) {
    themeStyleEl = pipWindow.document.createElement('style')
    themeStyleEl.id = 'pip-theme-vars'
    pipWindow.document.head.appendChild(themeStyleEl)
  }

  // Get background and text colors based on theme
  const bgColor = rootStyles.getPropertyValue('--b1').trim() || 'oklch(var(--b1))'
  const textColor = rootStyles.getPropertyValue('--bc').trim() || 'oklch(var(--bc))'
  const primaryColor = rootStyles.getPropertyValue('--p').trim() || 'oklch(var(--p))'
  const primaryContent = rootStyles.getPropertyValue('--pc').trim() || 'oklch(var(--pc))'

  themeStyleEl.textContent = `
    :root {
      ${cssVars}
    }
    body {
      background: oklch(${bgColor}) !important;
      color: oklch(${textColor}) !important;
    }
    .pip-timer {
      background: linear-gradient(135deg, oklch(${primaryColor}), oklch(${primaryColor} / 0.8)) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    .pip-status {
      color: oklch(${textColor} / 0.6) !important;
    }
    .pip-btn-primary {
      background: linear-gradient(135deg, oklch(${primaryColor}), oklch(${primaryColor} / 0.9)) !important;
      color: oklch(${primaryContent}) !important;
    }
    .pip-btn-ghost {
      background: oklch(${bgColor} / 0.1) !important;
      border: 1px solid oklch(${textColor} / 0.1) !important;
      color: oklch(${textColor} / 0.6) !important;
    }
    .pip-btn-ghost:hover {
      background: oklch(${bgColor} / 0.2) !important;
      color: oklch(${textColor}) !important;
    }
    .pip-challenge {
      background: oklch(${bgColor} / 0.5) !important;
      border: 1px solid oklch(${textColor} / 0.1) !important;
    }
    .pip-challenge-header {
      color: oklch(${primaryColor}) !important;
    }
    .pip-challenge-text {
      color: oklch(${textColor} / 0.7) !important;
    }
  `
}

function updatePiPTheme() {
  syncDaisyUITheme()
}

function getPiPCSS(): string {
  return `
    body {
      font-family: 'Inter', -apple-system, sans-serif !important;
      background: oklch(var(--b1, 15% 0 0)) !important;
      color: oklch(var(--bc, 95% 0 0)) !important;
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
      <div class="pip-status" id="pip-status">${countdown.isActive ? t('pip.inProgress') : t('pip.paused')}</div>
    </div>
    <div class="pip-controls">
      <button class="pip-btn pip-btn-primary" id="pip-toggle-btn">${countdown.isActive ? t('pip.stop') : t('pip.start')}</button>
      <button class="pip-btn pip-btn-ghost" id="pip-reset-btn">${t('pip.reset')}</button>
    </div>
    <div class="pip-challenge">
      <div class="pip-challenge-header">${t('pip.challenge')}</div>
      <p class="pip-challenge-text" id="pip-challenge-text">${challenges.currentChallenge ? challenges.currentChallenge.description : t('pip.startForChallenges')}</p>
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
      background: linear-gradient(135deg, oklch(var(--p)), oklch(var(--p) / 0.8));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pip-status { font-size: 13px; font-weight: 500; margin-top: 6px; color: oklch(var(--bc) / 0.6); }
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
    .pip-btn-primary { background: linear-gradient(135deg, oklch(var(--p)), oklch(var(--p) / 0.9)); color: oklch(var(--pc)); }
    .pip-btn-ghost {
      background: oklch(var(--b1) / 0.1);
      border: 1px solid oklch(var(--bc) / 0.1);
      color: oklch(var(--bc) / 0.6);
    }
    .pip-btn-ghost:hover { background: oklch(var(--b1) / 0.2); color: oklch(var(--bc)); }
    .pip-challenge {
      background: oklch(var(--b1) / 0.5);
      border: 1px solid oklch(var(--bc) / 0.1);
      border-radius: 14px;
      padding: 16px;
      flex: 1;
    }
    .pip-challenge-header {
      font-weight: 600; font-size: 11px;
      color: oklch(var(--p));
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .pip-challenge-text { font-size: 14px; color: oklch(var(--bc) / 0.7); line-height: 1.6; }
  `
}

function getFullHTML(): string {
  return `<!DOCTYPE html>
<html data-theme="${themeStore.currentTheme}">
<head>
  <title>Pomodoro</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: oklch(var(--b1, 15% 0 0));
      color: oklch(var(--bc, 95% 0 0));
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
