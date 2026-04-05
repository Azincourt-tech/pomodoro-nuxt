<template>
  <div class="card bg-base-100 shadow-sm overflow-hidden">
    <div class="card-body p-4 min-w-0">
      <!-- Display Mode -->
      <div
        v-if="!profile.isEditing"
        class="flex items-center gap-4"
      >
        <div class="avatar">
          <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              :src="profile.avatarUrl"
              :alt="profile.displayName"
            >
          </div>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-lg text-base-content">
            {{ profile.displayName }}
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <svg
              class="w-4 h-4 text-warning"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span class="badge badge-warning badge-sm font-semibold">{{
              $t('nav.level', { level: challenges.level })
            }}</span>
          </div>
        </div>
        <button
          class="btn btn-ghost btn-sm btn-circle"
          :title="$t('profile.edit')"
          @click="profile.setEditing(true)"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      <!-- Edit Mode -->
      <div
        v-else
        class="space-y-3"
      >
        <h3 class="font-bold text-lg">
          {{ $t('profile.editProfile') }}
        </h3>

        <!-- Manual Name -->
        <div class="form-control">
          <label class="label py-1 items-baseline">
            <span class="label-text font-medium">{{ $t('profile.name') }}</span>
          </label>
          <input
            v-model="nameInput"
            type="text"
            :placeholder="$t('profile.namePlaceholder')"
            class="input input-bordered input-sm w-full"
          >
        </div>

        <!-- Manual Avatar URL -->
        <div class="form-control">
          <label class="label py-1 items-baseline">
            <span class="label-text font-medium">{{ $t('profile.photoUrl') }}</span>
          </label>
          <input
            v-model="avatarInput"
            type="url"
            placeholder="https://..."
            class="input input-bordered input-sm w-full"
          >
          <label class="label py-1 items-baseline">
            <span class="label-text-alt">{{ $t('profile.pasteLink') }}</span>
          </label>
        </div>

        <!-- Preview -->
        <div class="flex items-baseline gap-3 p-3 bg-base-200 rounded-lg overflow-hidden">
          <div class="avatar shrink-0 self-center">
            <div class="w-12 rounded-full">
              <img
                :src="previewAvatar"
                :alt="nameInput"
              >
            </div>
          </div>
          <div class="min-w-0">
            <p class="font-medium text-sm truncate">
              {{ nameInput || $t('profile.defaultName') }}
            </p>
            <p class="text-xs text-base-content/60">
              {{ $t('profile.preview') }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            class="btn btn-primary btn-sm flex-1"
            @click="save"
          >
            {{ $t('profile.save') }}
          </button>
          <button
            class="btn btn-ghost btn-sm"
            @click="profile.setEditing(false)"
          >
            {{ $t('profile.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="px-4 pb-4">
      <div class="divider my-2">{{ $t('profile.notifications', 'Notificações') }}</div>
      
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-base-content/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="text-sm">{{ $t('profile.browserNotifications', 'Notificações do navegador') }}</span>
        </div>
        <button
          class="btn btn-sm"
          :class="notificationPermission === 'granted' ? 'btn-success' : 'btn-ghost'"
          @click="toggleNotifications"
        >
          {{ notificationPermission === 'granted' ? $t('profile.enabled', 'Ativado') : $t('profile.enable', 'Ativar') }}
        </button>
      </div>

      <div v-if="pushNotificationsSupported" class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-base-content/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span class="text-sm">{{ $t('profile.pushNotifications', 'Notificações push') }}</span>
        </div>
        <button
          class="btn btn-sm"
          :class="pushSubscribed ? 'btn-success' : 'btn-ghost'"
          :disabled="!pushPermissionGranted"
          @click="togglePushNotifications"
        >
          {{ pushSubscribed ? $t('profile.enabled', 'Ativado') : $t('profile.enable', 'Ativar') }}
        </button>
      </div>
      <p v-else class="text-xs text-base-content/50 mt-1">
        {{ $t('profile.pushNotSupported', 'Notificações push não suportadas neste navegador') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useChallengesStore } from '~/stores/challenges'
import { usePushNotification } from '~/composables/usePushNotification'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const profile = useProfileStore()
const challenges = useChallengesStore()
const { success, info, error } = useToast()
const { 
  isSupported: pushNotificationsSupported,
  permission: pushPermission,
  subscription: pushSubscription,
  requestPermission: requestPushPermission,
  subscribeToPush,
  unsubscribeFromPush 
} = usePushNotification()

const nameInput = ref('')
const avatarInput = ref('')
const notificationPermission = ref<NotificationPermission>('default')
const pushSubscribed = computed(() => !!pushSubscription.value)
const pushPermissionGranted = computed(() => pushPermission.value === 'granted')

onMounted(() => {
  profile.loadFromStorage()
  nameInput.value = profile.profile.name
  avatarInput.value = profile.profile.avatar
  
  // Check notification permission
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission
  }
})

const previewAvatar = computed(() => {
  if (avatarInput.value) return avatarInput.value
  if (profile.profile.githubUsername) {
    return `https://github.com/${profile.profile.githubUsername}.png`
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value || 'User')}&background=6366f1&color=fff&size=128`
})

function save() {
  profile.updateProfile({
    name: nameInput.value || t('profile.defaultName'),
    avatar: avatarInput.value,
  })
  profile.setEditing(false)
  success(t('profile.profileSaved', 'Perfil salvo com sucesso!'))
}

async function toggleNotifications() {
  if (!('Notification' in window)) {
    error(t('profile.notificationsNotSupported', 'Notificações não suportadas neste navegador'))
    return
  }

  if (notificationPermission.value === 'granted') {
    info(t('profile.notificationsGranted', 'Notificações já estão ativadas. Para desativar, altere nas configurações do navegador.'))
  } else if (notificationPermission.value === 'denied') {
    error(t('profile.notificationsDenied', 'Notificações foram bloqueadas. Para ativá-las, altere nas configurações do navegador.'))
  } else {
    const result = await Notification.requestPermission()
    notificationPermission.value = result
    if (result === 'granted') {
      success(t('profile.notificationsEnabled', 'Notificações ativadas!'))
    }
  }
}

async function togglePushNotifications() {
  if (!pushNotificationsSupported.value) {
    error(t('profile.pushNotSupported', 'Notificações push não suportadas neste navegador'))
    return
  }

  if (pushSubscribed.value) {
    const unsubscribed = await unsubscribeFromPush()
    if (unsubscribed) {
      success(t('profile.pushUnsubscribed', 'Notificações push desativadas'))
    }
  } else {
    const granted = await requestPushPermission()
    if (granted) {
      const subscription = await subscribeToPush()
      if (subscription) {
        success(t('profile.pushSubscribed', 'Notificações push ativadas com sucesso!'))
      } else {
        error(t('profile.pushSubscriptionFailed', 'Falha ao ativar notificações push'))
      }
    }
  }
}
</script>
