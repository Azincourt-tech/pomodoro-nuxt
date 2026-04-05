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
      <div v-if="isOpen" class="modal-box bg-gradient-to-br from-base-100 via-base-200 to-base-100 border border-primary/20 shadow-2xl max-w-lg relative">
        <!-- Decorative background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <!-- Close button -->
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
          @click="close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-6 relative z-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-black font-rajdhani bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {{ $t('shortcuts.title', 'Atalhos de Teclado') }}
          </h3>
          <p class="text-sm text-base-content/60 mt-1">{{ $t('shortcuts.subtitle', 'Acesse rapidamente as principais funções') }}</p>
        </div>

        <!-- Shortcuts List -->
        <div class="space-y-3 relative z-10">
          <div
            v-for="(shortcut, index) in shortcuts"
            :key="shortcut.key"
            class="flex items-center justify-between p-4 bg-base-100/80 backdrop-blur-sm rounded-xl border border-base-300/30 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-base-200/50 rounded-lg group-hover:bg-primary/10 transition-colors duration-200">
                <span class="text-lg">{{ shortcut.icon }}</span>
              </div>
              <span class="text-sm font-medium text-base-content/80">{{ shortcut.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <kbd class="kbd kbd-sm bg-gradient-to-br from-base-200 to-base-300 border border-base-400/50 font-mono text-base-content/70 shadow-sm group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/30 transition-all duration-200">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 p-4 bg-info/10 rounded-xl border border-info/20 relative z-10">
          <p class="text-xs text-base-content/60 flex items-center gap-2">
            <svg class="w-4 h-4 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ $t('shortcuts.note', 'Atalhos desabilitados quando um input está focado') }}</span>
          </p>
        </div>

        <div class="modal-action justify-center relative z-10">
          <button
            class="btn btn-primary gap-2"
            @click="close"
          >
            <span>{{ $t('shortcuts.close', 'Fechar') }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
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

const { t } = useI18n()
const isOpen = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)

const shortcuts = computed(() => [
  { key: 'Space', label: t('shortcuts.togglePlay', 'Iniciar/Pausar'), icon: '▶️' },
  { key: 'R', label: t('shortcuts.reset', 'Resetar Timer'), icon: '🔄' },
  { key: 'N', label: t('shortcuts.nextChallenge', 'Próximo Desafio'), icon: '🎯' },
  { key: 'F', label: t('shortcuts.focusMode', 'Modo Foco'), icon: '🎯' },
  { key: '?', label: t('shortcuts.showHelp', 'Mostrar Ajuda'), icon: '❓' },
])

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
