import { onMounted, onUnmounted } from 'vue'

interface ShortcutHandlers {
  onTogglePlay: () => void
  onReset: () => void
  onNextChallenge: () => void
  onFocusMode: () => void
  onShowHelp: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  function isInputFocused(): boolean {
    const el = document.activeElement
    if (!el) return false
    const tag = el.tagName.toLowerCase()
    return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isInputFocused()) return

    switch (event.key) {
      case ' ':
        event.preventDefault()
        handlers.onTogglePlay()
        break
      case 'r':
      case 'R':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault()
          handlers.onReset()
        }
        break
      case 'n':
      case 'N':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault()
          handlers.onNextChallenge()
        }
        break
      case 'f':
      case 'F':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault()
          handlers.onFocusMode()
        }
        break
      case '?':
        event.preventDefault()
        handlers.onShowHelp()
        break
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return { isInputFocused }
}
