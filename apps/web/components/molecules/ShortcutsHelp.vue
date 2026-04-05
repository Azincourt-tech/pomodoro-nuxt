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
      <div v-if="isOpen" class="modal-box bg-gradient-to-br from-base-100 via-base-100/95 to-base-200/80 backdrop-blur-xl border border-primary/25 shadow-2xl max-w-lg relative overflow-hidden">
        <!-- Decorative background with animations -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
        </div>

        <!-- Close button -->
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10 hover:bg-base-200/60 transition-all duration-200"
          @click="close"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>

        <!-- Header with enhanced design -->
        <div class="text-center mb-6 relative z-10">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15 mb-4 shadow-xl ring-4 ring-primary/10">
            <Icon name="lucide:keyboard" class="w-10 h-10 text-primary drop-shadow-lg" />
          </div>
          <h3 class="text-3xl font-black font-rajdhani bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {{ $t('shortcuts.title', 'Atalhos de Teclado') }}
          </h3>
          <p class="text-sm text-base-content/60 mt-2 flex items-center justify-center gap-2">
            <Icon name="lucide:zap" class="w-4 h-4 text-warning" />
            {{ $t('shortcuts.subtitle', 'Acesse rapidamente as principais funções') }}
            <Icon name="lucide:zap" class="w-4 h-4 text-warning" />
          </p>
        </div>

        <!-- Shortcuts List with enhanced design -->
        <div class="space-y-3 relative z-10">
          <div
            v-for="(shortcut, index) in shortcuts"
            :key="shortcut.key"
            class="group flex items-center justify-between p-4 bg-gradient-to-r from-base-100/80 via-base-100/60 to-base-200/50 backdrop-blur-md rounded-2xl border border-base-300/25 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center gap-4">
              <div class="p-2.5 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl shadow-md group-hover:from-primary/25 group-hover:to-primary/10 group-hover:scale-110 transition-all duration-300">
                <Icon 
                  :name="shortcut.icon" 
                  class="w-6 h-6 text-primary group-hover:drop-shadow-lg transition-all duration-300" 
                />
              </div>
              <span class="text-sm font-bold text-base-content/85 group-hover:text-base-content transition-colors">{{ shortcut.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <kbd class="kbd kbd-md min-w-[3rem] bg-gradient-to-br from-base-200 via-base-200/80 to-base-300/60 border border-base-400/40 font-mono font-bold text-sm text-base-content/80 shadow-lg group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-secondary/10 group-hover:border-primary/40 group-hover:text-primary transition-all duration-300 hover:scale-105">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Footer Note with enhanced design -->
        <div class="mt-6 p-4 bg-gradient-to-r from-info/10 via-info/5 to-info/10 rounded-2xl border border-info/25 shadow-lg relative z-10">
          <p class="text-xs text-base-content/70 flex items-start gap-3">
            <div class="p-1.5 bg-info/20 rounded-lg shrink-0 mt-0.5">
              <Icon name="lucide:info" class="w-4 h-4 text-info" />
            </div>
            <span class="leading-relaxed">{{ $t('shortcuts.note', 'Atalhos desabilitados quando um input está focado') }}</span>
          </p>
        </div>

        <div class="modal-action justify-center relative z-10">
          <button
            class="btn btn-primary gap-2 px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            @click="close"
          >
            <Icon name="lucide:check" class="w-5 h-5" />
            <span class="font-semibold">{{ $t('shortcuts.close', 'Fechar') }}</span>
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
  { key: 'Space', label: t('shortcuts.togglePlay', 'Iniciar/Pausar'), icon: 'lucide:play' },
  { key: 'R', label: t('shortcuts.reset', 'Resetar Timer'), icon: 'lucide:rotate-ccw' },
  { key: 'N', label: t('shortcuts.nextChallenge', 'Próximo Desafio'), icon: 'lucide:target' },
  { key: 'F', label: t('shortcuts.focusMode', 'Modo Foco'), icon: 'lucide:focus' },
  { key: '?', label: t('shortcuts.showHelp', 'Mostrar Ajuda'), icon: 'lucide:help-circle' },
])

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-box > div:nth-child(3) > div {
  animation: fadeInUp 0.3s ease-out backwards;
}

.modal-box > div:nth-child(3) > div:nth-child(1) { animation-delay: 100ms; }
.modal-box > div:nth-child(3) > div:nth-child(2) { animation-delay: 150ms; }
.modal-box > div:nth-child(3) > div:nth-child(3) { animation-delay: 200ms; }
.modal-box > div:nth-child(3) > div:nth-child(4) { animation-delay: 250ms; }
.modal-box > div:nth-child(3) > div:nth-child(5) { animation-delay: 300ms; }
</style>
