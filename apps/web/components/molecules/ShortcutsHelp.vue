<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold font-rajdhani mb-4">
        {{ $t('shortcuts.title') }}
      </h3>
      <div class="space-y-3">
        <div
          v-for="shortcut in shortcuts"
          :key="shortcut.key"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-base-content/70">{{ shortcut.label }}</span>
          <kbd class="kbd kkbd kbd-sm bg-base-200">{{ shortcut.key }}</kbd>
        </div>
      </div>
      <div class="modal-action">
        <button
          class="btn btn-sm"
          @click="close"
        >
          {{ $t('shortcuts.close') }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
      @click="close"
    >
      <button>{{ $t('shortcuts.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isOpen = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)

const { t } = useI18n()

const shortcuts = computed(() => [
  { key: 'Space', label: t('shortcuts.togglePlay') },
  { key: 'R', label: t('shortcuts.reset') },
  { key: 'N', label: t('shortcuts.nextChallenge') },
  { key: 'F', label: t('shortcuts.focusMode') },
  { key: '?', label: t('shortcuts.showHelp') },
])

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
