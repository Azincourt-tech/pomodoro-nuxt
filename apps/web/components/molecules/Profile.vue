<template>
  <div class="card bg-base-100 shadow-lg border border-base-300/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Header gradient background -->
    <div class="h-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 relative">
      <div class="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <div class="relative">
          <div class="avatar">
            <div class="w-20 rounded-full ring-4 ring-base-100 shadow-xl">
              <img
                :src="profile.avatarUrl"
                :alt="profile.displayName"
                class="transition-transform duration-300 hover:scale-105"
              >
            </div>
          </div>
          <!-- Edit badge -->
          <button
            v-if="!profile.isEditing"
            class="absolute -bottom-1 -right-1 btn btn-circle btn-primary btn-xs shadow-lg"
            :title="$t('profile.edit')"
            @click="profile.setEditing(true)"
          >
            <Icon name="lucide:edit" class="w-3 h-3" />>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="card-body p-5 pt-10 min-w-0">
      <!-- Display Mode -->
      <div
        v-if="!profile.isEditing"
        class="text-center"
      >
        <h3 class="font-bold text-xl text-base-content mb-1">
          {{ profile.displayName }}
        </h3>
        
        <!-- Level badge -->
        <div class="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-warning/10 rounded-full">
          <Icon name="lucide:star" class="w-4 h-4 text-warning" />>
          </svg>
          <span class="text-sm font-bold text-warning">{{ $t('nav.level', { level: challenges.level }) }}</span>
        </div>

        <!-- Quick stats -->
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div class="text-center p-2 bg-base-200/50 rounded-lg">
            <p class="text-xs text-base-content/50">{{ $t('profile.xp', 'XP') }}</p>
            <p class="text-lg font-bold text-primary">{{ challenges.xp.current }}</p>
          </div>
          <div class="text-center p-2 bg-base-200/50 rounded-lg">
            <p class="text-xs text-base-content/50">{{ $t('profile.completed', 'Completos') }}</p>
            <p class="text-lg font-bold text-success">{{ challenges.completedChallenges }}</p>
          </div>
          <div class="text-center p-2 bg-base-200/50 rounded-lg">
            <p class="text-xs text-base-content/50">{{ $t('profile.streak', 'Sequência') }}</p>
            <p class="text-lg font-bold text-error">🔥 {{ profile.streakCurrent }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div
        v-else
        class="space-y-4 animate-fadeIn"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">{{ $t('profile.editProfile') }}</h3>
          <button
            class="btn btn-ghost btn-circle btn-sm"
            @click="profile.setEditing(false)"
          >
            <Icon name="lucide:x" class="w-4 h-4" />>
            </svg>
          </button>
        </div>

        <!-- Name Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-sm flex items-center gap-2">
              <Icon name="lucide:user" class="w-4 h-4" />>
              </svg>
              {{ $t('profile.name') }}
            </span>
          </label>
          <input
            v-model="nameInput"
            type="text"
            :placeholder="$t('profile.namePlaceholder')"
            class="input input-bordered w-full focus:input-primary transition-all"
          >
        </div>

        <!-- Avatar URL Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ $t('profile.photoUrl') }}
            </span>
          </label>
          <input
            v-model="avatarInput"
            type="url"
            placeholder="https://..."
            class="input input-bordered w-full focus:input-primary transition-all"
          >
          <label class="label">
            <span class="label-text-alt text-base-content/50">{{ $t('profile.pasteLink') }}</span>
          </label>
        </div>

        <!-- Preview Card -->
        <div class="p-4 bg-base-200/50 rounded-xl border border-base-300/50">
          <p class="text-xs font-medium text-base-content/50 mb-2">{{ $t('profile.preview') }}</p>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-12 rounded-full ring-2 ring-primary/20">
                <img :src="previewAvatar" :alt="nameInput">
              </div>
            </div>
            <div>
              <p class="font-bold text-sm">{{ nameInput || $t('profile.defaultName') }}</p>
              <p class="text-xs text-base-content/50">Level {{ challenges.level }}</p>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <button
          class="btn btn-primary w-full"
          @click="save"
        >
          <Icon name="lucide:check" class="w-4 h-4" />>
          </svg>
          {{ $t('profile.save') }}
        </button>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="px-5 pb-5">
      <div class="divider my-3">{{ $t('profile.notifications', 'Notificações') }}</div>
      
      <div class="space-y-2">
        <!-- Browser Notifications -->
        <div class="flex items-center justify-between p-3 bg-base-200/50 rounded-lg hover:bg-base-200 transition-colors">
          <div class="flex items-center gap-3">
            <div class="p-1.5 bg-base-300/50 rounded-md">
              <Icon name="lucide:bell" class="w-4 h-4 text-base-content/70" />>
              </svg>
            </div>
            <div>
              <span class="text-sm font-medium">{{ $t('profile.browserNotifications', 'Notificações do navegador') }}</span>
            </div>
          </div>
          <button
            class="btn btn-sm"
            :class="notificationPermission === 'granted' ? 'btn-success btn-outline' : 'btn-ghost'"
            @click="toggleNotifications"
          >
            {{ notificationPermission === 'granted' ? $t('profile.enabled', 'Ativado') : $t('profile.enable', 'Ativar') }}
          </button>
        </div>

        <!-- Push Notifications -->
        <div
          v-if="pushNotificationsSupported"
          class="flex items-center justify-between p-3 bg-base-200/50 rounded-lg hover:bg-base-200 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="p-1.5 bg-base-300/50 rounded-md">
              <Icon name="lucide:smartphone" class="w-4 h-4 text-base-content/70" />>
              </svg>
            </div>
            <div>
              <span class="text-sm font-medium">{{ $t('profile.pushNotifications', 'Notificações push') }}</span>
            </div>
          </div>
          <button
            class="btn btn-sm"
            :class="pushSubscribed ? 'btn-success btn-outline' : 'btn-ghost'"
            :disabled="!pushPermissionGranted"
            @click="togglePushNotifications"
          >
            {{ pushSubscribed ? $t('profile.enabled', 'Ativado') : $t('profile.enable', 'Ativar') }}
          </button>
        </div>
        <p v-else class="text-xs text-base-content/50 text-center">
          {{ $t('profile.pushNotSupported', 'Notificações push não suportadas') }}
        </p>
      </div>
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
    error(t('profile.notificationsNotSupported', 'Notificações não suportadas'))
    return
  }

  if (notificationPermission.value === 'granted') {
    info(t('profile.notificationsGranted', 'Já ativadas. Para desativar, use as configurações do navegador.'))
  } else if (notificationPermission.value === 'denied') {
    error(t('profile.notificationsDenied', 'Bloqueadas. Altere nas configurações do navegador.'))
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
    error(t('profile.pushNotSupported', 'Push não suportado'))
    return
  }

  if (pushSubscribed.value) {
    const unsubscribed = await unsubscribeFromPush()
    if (unsubscribed) {
      success(t('profile.pushUnsubscribed', 'Push desativado'))
    }
  } else {
    const granted = await requestPushPermission()
    if (granted) {
      const subscription = await subscribeToPush()
      if (subscription) {
        success(t('profile.pushSubscribed', 'Push ativado com sucesso!'))
      } else {
        error(t('profile.pushSubscriptionFailed', 'Falha ao ativar push'))
      }
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
