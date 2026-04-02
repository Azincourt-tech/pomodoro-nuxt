import { ref, onMounted, onUnmounted } from 'vue'

export function usePwaInstall() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const canInstall = ref(false)
  const isInstalled = ref(false)

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }

  function handleBeforeInstallPrompt(e: Event) {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    canInstall.value = true
  }

  function handleAppInstalled() {
    isInstalled.value = true
    canInstall.value = false
    deferredPrompt.value = null
  }

  async function install(): Promise<boolean> {
    if (!deferredPrompt.value) return false

    try {
      await deferredPrompt.value.prompt()
      const choice = await deferredPrompt.value.userChoice

      if (choice.outcome === 'accepted') {
        isInstalled.value = true
        canInstall.value = false
        deferredPrompt.value = null
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function dismiss() {
    canInstall.value = false
    deferredPrompt.value = null
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    // Check if already running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true
      return
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  })

  return {
    canInstall,
    isInstalled,
    install,
    dismiss,
  }
}
