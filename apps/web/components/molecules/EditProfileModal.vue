<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
  >
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="modal-box max-w-md p-0 overflow-hidden relative bg-gradient-to-br from-base-100 via-base-100/95 to-base-200/80 backdrop-blur-xl border border-primary/25 shadow-2xl rounded-2xl">
        <!-- Decorative background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
        </div>

        <!-- Header -->
        <div class="relative z-10 bg-gradient-to-r from-primary to-secondary p-5 flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon name="lucide:user" class="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <h3 class="text-xl font-black text-white">{{ $t('profile.editProfile') }}</h3>
          </div>
          <button
            class="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 transition-all"
            @click="close"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-6 space-y-5">
          <!-- Avatar Preview with enhanced design -->
          <div class="bg-gradient-to-br from-base-200/60 to-base-300/40 rounded-2xl p-5 border border-base-300/30 shadow-inner">
            <div class="flex items-center gap-4">
              <div class="avatar ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100 rounded-full shadow-xl">
                <div class="w-20 rounded-full overflow-hidden">
                  <img
                    :src="previewAvatar"
                    :alt="nameInput"
                    class="rounded-full"
                  >
                </div>
              </div>
              <div class="flex-1">
                <p class="font-bold text-base text-base-content">{{ nameInput || $t('profile.defaultName') }}</p>
                <p class="text-xs text-base-content/60 mt-1 flex items-center gap-1.5">
                  <Icon name="lucide:eye" class="w-3.5 h-3.5" />
                  {{ $t('profile.preview') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Name Input -->
          <div class="form-control">
            <label class="label py-2">
              <span class="label-text font-bold text-sm flex items-center gap-2">
                <Icon name="lucide:pencil" class="w-4 h-4 text-primary" />
                {{ $t('profile.name') }}
              </span>
            </label>
            <input
              v-model="nameInput"
              type="text"
              :placeholder="$t('profile.namePlaceholder')"
              class="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm"
            >
          </div>

          <!-- Avatar URL Input -->
          <div class="form-control">
            <label class="label py-2">
              <span class="label-text font-bold text-sm flex items-center gap-2">
                <Icon name="lucide:image" class="w-4 h-4 text-primary" />
                {{ $t('profile.photoUrl') }}
              </span>
            </label>
            <input
              v-model="avatarInput"
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              class="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm"
            >
            <label class="label py-1">
              <span class="label-text-alt text-base-content/50 flex items-center gap-1.5">
                <Icon name="lucide:info" class="w-3 h-3" />
                {{ $t('profile.pasteLink') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="relative z-10 modal-action p-5 bg-gradient-to-r from-base-200/60 via-base-200/40 to-base-300/30 border-t border-base-300/30">
          <div class="flex gap-3 w-full">
            <button
              class="btn btn-primary flex-[2] gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              @click="save"
            >
              <Icon name="lucide:check" class="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span class="font-semibold">{{ $t('profile.save') }}</span>
            </button>
            <button
              class="btn btn-ghost flex-1 gap-2 hover:bg-base-200/50 transition-all duration-300"
              @click="close"
            >
              <Icon name="lucide:x" class="w-4 h-4" />
              <span class="font-medium">{{ $t('profile.cancel') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

const previewAvatar = computed(() => {
  if (avatarInput.value) return avatarInput.value
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value || 'User')}&background=6366f1&color=fff&size=128`
})

function save() {
  profile.updateProfile({
    name: nameInput.value || t('profile.defaultName'),
    avatar: avatarInput.value,
  })
  close()
}

function open() {
  // Load current values
  nameInput.value = profile.profile.name
  avatarInput.value = profile.profile.avatar
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
