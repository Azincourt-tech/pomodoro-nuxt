<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
  >
    <div class="modal-box max-w-md">
      <h3 class="text-lg font-bold font-rajdhani mb-4">
        {{ $t('profile.editProfile') }}
      </h3>

      <div class="space-y-4">
        <!-- Avatar Preview -->
        <div class="flex items-center gap-4">
          <div class="avatar">
            <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                :src="previewAvatar"
                :alt="nameInput"
              >
            </div>
          </div>
          <div class="flex-1">
            <p class="font-medium text-sm">
              {{ nameInput || $t('profile.defaultName') }}
            </p>
            <p class="text-xs text-base-content/60">
              {{ $t('profile.preview') }}
            </p>
          </div>
        </div>

        <!-- GitHub Login -->
        <div class="form-control">
          <label class="label py-1 items-baseline">
            <span class="label-text font-medium">{{ $t('profile.githubUsername') }}</span>
          </label>
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <input
              v-model="githubInput"
              type="text"
              :placeholder="$t('profile.githubPlaceholder')"
              class="input input-bordered input-sm w-full min-w-0"
              @keyup.enter="saveGithub"
            >
            <button
              class="btn btn-sm btn-primary shrink-0"
              @click="saveGithub"
            >
              {{ $t('profile.save') }}
            </button>
          </div>
          <label
            v-if="profile.profile.githubUsername"
            class="label py-1 items-baseline"
          >
            <span class="label-text-alt text-success truncate">{{
              $t('profile.connectedAs', { username: profile.profile.githubUsername })
            }}</span>
            <button
              class="label-text-alt link link-error shrink-0"
              @click="clearGithub"
            >
              {{ $t('profile.remove') }}
            </button>
          </label>
        </div>

        <div class="divider text-xs my-2">
          {{ $t('profile.or') }}
        </div>

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
            :disabled="!!profile.profile.githubUsername"
          >
          <label class="label py-1 items-baseline">
            <span class="label-text-alt">{{ $t('profile.pasteLink') }}</span>
          </label>
        </div>
      </div>

      <div class="modal-action">
        <button
          class="btn btn-primary"
          @click="save"
        >
          {{ $t('profile.save') }}
        </button>
        <button
          class="btn btn-ghost"
          @click="close"
        >
          {{ $t('profile.cancel') }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
      @click="close"
    >
      <button>{{ $t('profile.cancel') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore } from '~/stores/profile'

const { t } = useI18n()
const profile = useProfileStore()

const isOpen = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)

const nameInput = ref('')
const avatarInput = ref('')
const githubInput = ref('')

const previewAvatar = computed(() => {
  if (githubInput.value && !profile.profile.githubUsername) {
    return `https://github.com/${githubInput.value}.png`
  }
  if (avatarInput.value) return avatarInput.value
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value || 'User')}&background=6366f1&color=fff&size=128`
})

function saveGithub() {
  if (githubInput.value.trim()) {
    profile.setGithubUser(githubInput.value.trim())
    nameInput.value = githubInput.value.trim()
  }
}

function clearGithub() {
  profile.clearGithubUser()
  githubInput.value = ''
}

function save() {
  profile.updateProfile({
    name: nameInput.value || t('profile.defaultName'),
    avatar: profile.profile.githubUsername ? '' : avatarInput.value,
  })
  close()
}

function open() {
  // Load current values
  nameInput.value = profile.profile.name
  avatarInput.value = profile.profile.avatar
  githubInput.value = profile.profile.githubUsername || ''
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
