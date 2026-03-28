<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-3">
      <!-- Display Mode -->
      <div v-if="!profile.isEditing" class="flex items-center gap-3">
        <div class="avatar">
          <div class="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
            <img :src="profile.avatarUrl" :alt="profile.displayName" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-base text-base-content truncate">{{ profile.displayName }}</h3>
          <div class="flex items-center gap-2 mt-0.5">
            <svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="badge badge-warning badge-sm font-semibold">Level {{ challenges.level }}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-xs btn-circle" @click="profile.setEditing(true)" title="Editar perfil">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-3">
        <h3 class="font-bold text-sm">Editar Perfil</h3>

        <div class="form-control">
          <div class="flex gap-2">
            <input
              v-model="githubInput"
              type="text"
              placeholder="GitHub username"
              class="input input-bordered input-xs flex-1"
              @keyup.enter="saveGithub"
            />
            <button class="btn btn-xs btn-primary" @click="saveGithub">Usar</button>
          </div>
          <label class="label py-0" v-if="profile.profile.githubUsername">
            <span class="label-text-alt text-success text-xs">{{ profile.profile.githubUsername }}</span>
            <button class="label-text-alt link link-error text-xs" @click="clearGithub">Remover</button>
          </label>
        </div>

        <div class="form-control">
          <input v-model="nameInput" type="text" placeholder="Nome" class="input input-bordered input-xs" />
        </div>

        <div class="flex gap-2">
          <button class="btn btn-primary btn-xs flex-1" @click="save">Salvar</button>
          <button class="btn btn-ghost btn-xs" @click="profile.setEditing(false)">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '~/stores/profile'
import { useChallengesStore } from '~/stores/challenges'

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
    name: nameInput.value || 'User',
    avatar: profile.profile.githubUsername ? '' : avatarInput.value,
  })
  profile.setEditing(false)
}
</script>
