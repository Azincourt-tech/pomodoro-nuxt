<template>
  <div class="card bg-base-100 shadow-sm overflow-hidden">
    <div class="card-body p-4 min-w-0">
      <!-- Display Mode -->
      <div v-if="!profile.isEditing" class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img :src="profile.avatarUrl" :alt="profile.displayName" />
          </div>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-lg text-base-content">{{ profile.displayName }}</h3>
          <div class="flex items-center gap-2 mt-1">
            <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="badge badge-warning badge-sm font-semibold">{{ $t('nav.level', { level: challenges.level }) }}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle" @click="profile.setEditing(true)" :title="$t('profile.edit')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-3">
        <h3 class="font-bold text-lg">{{ $t('profile.editProfile') }}</h3>

        <!-- GitHub Login -->
        <div class="form-control">
          <label class="label py-1 items-center">
            <span class="label-text font-medium">{{ $t('profile.githubUsername') }}</span>
          </label>
          <div class="grid grid-cols-[1fr_auto] gap-2">
            <input
              v-model="githubInput"
              type="text"
              :placeholder="$t('profile.githubPlaceholder')"
              class="input input-bordered input-sm w-full min-w-0"
              @keyup.enter="saveGithub"
            />
            <button class="btn btn-sm btn-primary shrink-0" @click="saveGithub">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {{ $t('profile.save') }}
            </button>
          </div>
          <label class="label py-1 items-center" v-if="profile.profile.githubUsername">
            <span class="label-text-alt text-success truncate">{{ $t('profile.connectedAs', { username: profile.profile.githubUsername }) }}</span>
            <button class="label-text-alt link link-error shrink-0" @click="clearGithub">{{ $t('profile.remove') }}</button>
          </label>
        </div>

        <div class="divider text-xs my-2">{{ $t('profile.or') }}</div>

        <!-- Manual Name -->
        <div class="form-control">
          <label class="label py-1 items-center">
            <span class="label-text font-medium">{{ $t('profile.name') }}</span>
          </label>
          <input
            v-model="nameInput"
            type="text"
            :placeholder="$t('profile.namePlaceholder')"
            class="input input-bordered input-sm w-full"
          />
        </div>

        <!-- Manual Avatar URL -->
        <div class="form-control">
          <label class="label py-1 items-center">
            <span class="label-text font-medium">{{ $t('profile.photoUrl') }}</span>
          </label>
          <input
            v-model="avatarInput"
            type="url"
            placeholder="https://..."
            class="input input-bordered input-sm w-full"
            :disabled="!!profile.profile.githubUsername"
          />
          <label class="label py-1 items-center">
            <span class="label-text-alt">{{ $t('profile.pasteLink') }}</span>
          </label>
        </div>

        <!-- Preview -->
        <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg overflow-hidden">
          <div class="avatar shrink-0">
            <div class="w-12 rounded-full">
              <img :src="previewAvatar" :alt="nameInput" />
            </div>
          </div>
          <div class="min-w-0">
            <p class="font-medium text-sm truncate">{{ nameInput || $t('profile.defaultName') }}</p>
            <p class="text-xs text-base-content/60">{{ $t('profile.preview') }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm flex-1" @click="save">{{ $t('profile.save') }}</button>
          <button class="btn btn-ghost btn-sm" @click="profile.setEditing(false)">{{ $t('profile.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useChallengesStore } from '~/stores/challenges'

const { t } = useI18n()
const profile = useProfileStore()
const challenges = useChallengesStore()

const nameInput = ref('')
const avatarInput = ref('')
const githubInput = ref('')

onMounted(() => {
  profile.loadFromStorage()
  nameInput.value = profile.profile.name
  avatarInput.value = profile.profile.avatar
  githubInput.value = profile.profile.githubUsername || ''
})

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
  profile.setEditing(false)
}
</script>
