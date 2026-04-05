import { ref } from 'vue'

export function usePushNotification() {
  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const subscription = ref<PushSubscription | null>(null)

  onMounted(() => {
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window
    
    if (isSupported.value) {
      permission.value = Notification.permission
      
      // Check for existing subscription
      checkExistingSubscription()
    }
  })

  async function checkExistingSubscription() {
    if (!isSupported.value) return
    
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        subscription.value = existingSubscription
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  async function requestPermission() {
    if (!isSupported.value) {
      console.warn('Push notifications not supported')
      return false
    }

    if (permission.value === 'granted') {
      return true
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      
      if (result === 'granted') {
        await subscribeToPush()
      }
      
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting permission:', error)
      return false
    }
  }

  async function subscribeToPush() {
    if (!isSupported.value) return null

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Unsubscribe existing first
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        await existingSubscription.unsubscribe()
      }

      // Subscribe with VAPID public key (optional for basic push)
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      })

      subscription.value = newSubscription
      
      // Send subscription to backend if needed
      await sendSubscriptionToServer(newSubscription)
      
      return newSubscription
    } catch (error) {
      console.error('Error subscribing to push:', error)
      return null
    }
  }

  async function unsubscribeFromPush() {
    if (!subscription.value) return false

    try {
      await subscription.value.unsubscribe()
      subscription.value = null
      
      // Notify server
      await unsubscribeFromServer()
      
      return true
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return false
    }
  }

  async function sendSubscriptionToServer(subscription: PushSubscription) {
    // Implementation depends on your backend
    // For now, just log it
    console.log('Subscription to send to server:', subscription.toJSON())
    
    // Example:
    // await $fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   body: subscription.toJSON()
    // })
  }

  async function unsubscribeFromServer() {
    // Notify server to remove subscription
    console.log('Unsubscribing from server')
    
    // Example:
    // await $fetch('/api/push/unsubscribe', {
    //   method: 'POST'
    // })
  }

  // Helper: Convert VAPID key from base64 string to Uint8Array
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    if (!base64String) {
      // Return a dummy key if not configured (not recommended for production)
      return new Uint8Array(65)
    }
    
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
  }
}
