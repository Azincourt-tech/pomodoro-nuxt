import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function addToast(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return addToast(message, 'success', duration)
  }

  function info(message: string, duration?: number) {
    return addToast(message, 'info', duration)
  }

  function warning(message: string, duration?: number) {
    return addToast(message, 'warning', duration)
  }

  function error(message: string, duration?: number) {
    return addToast(message, 'error', duration)
  }

  function clearAll() {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    info,
    warning,
    error,
    clearAll,
  }
}
