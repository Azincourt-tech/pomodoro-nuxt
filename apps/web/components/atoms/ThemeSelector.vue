<template>
  <div class="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-base-300/40 hover:shadow-2xl transition-all duration-300">
    <div class="card-body p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-secondary/10 rounded-lg">
            <Icon name="lucide:palette" class="w-5 h-5 text-secondary" />
          </div>
          <h3 class="font-bold text-base">
            {{ $t('nav.theme') }}
          </h3>
        </div>
        <span class="text-xs text-base-content/50">{{ themes.length }} temas</span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="t in themes"
          :key="t"
          class="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105"
          :class="
            theme.currentTheme === t 
              ? 'bg-primary/10 ring-2 ring-primary shadow-md' 
              : 'bg-base-200/50 hover:bg-base-200 hover:shadow-md'
          "
          @click="handleThemeChange(t)"
        >
          <!-- Theme preview circle -->
          <div class="relative">
            <span
              class="w-11 h-11 rounded-full block shadow-lg ring-2 ring-base-300/50 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/50"
              :class="previewColor(t)"
            />
            <!-- Checkmark for active theme -->
            <Transition
              enter-active-class="transition-all duration-200"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
            >
              <div
                v-if="theme.currentTheme === t"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="bg-primary rounded-full p-0.5">
                  <svg
                    class="w-3 h-3 text-primary-content"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                </div>
              </div>
            </Transition>
          </div>
          
          <!-- Theme name -->
          <span class="text-xs font-medium capitalize text-center">{{ t }}</span>
        </button>
      </div>

      <!-- Auto Dark Mode Toggle -->
      <div class="divider my-3" />
      <div class="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="p-1.5 bg-base-300/50 rounded-md">
            <Icon name="lucide:moon" class="w-4 h-4 text-base-content/70" />
          </div>
          <div>
            <span class="text-sm font-medium">{{ $t('theme.autoDarkMode', 'Modo escuro automático') }}</span>
            <p class="text-xs text-base-content/50 mt-0.5">{{ $t('theme.autoDarkModeDesc', 'Segue preferencia do sistema') }}</p>
          </div>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          :checked="theme.autoDarkMode"
          @change="handleAutoDarkModeToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore, AVAILABLE_THEMES } from '~/stores/theme'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const theme = useThemeStore()
const { success } = useToast()
const themes = AVAILABLE_THEMES

function previewColor(t: string) {
  const map: Record<string, string> = {
    light: 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300',
    dark: 'bg-gradient-to-br from-gray-800 to-gray-900',
    cupcake: 'bg-gradient-to-br from-pink-200 to-pink-300',
    dracula: 'bg-gradient-to-br from-purple-900 to-indigo-900',
    synthwave: 'bg-gradient-to-br from-fuchsia-600 to-purple-700',
    retro: 'bg-gradient-to-br from-orange-200 to-amber-200',
    cyberpunk: 'bg-gradient-to-br from-yellow-400 to-cyan-400',
    valentine: 'bg-gradient-to-br from-pink-400 to-rose-400',
    aqua: 'bg-gradient-to-br from-cyan-400 to-teal-400',
    lofi: 'bg-gradient-to-br from-gray-300 to-gray-400',
  }
  return map[t] || 'bg-gray-400'
}

function handleThemeChange(t: string) {
  theme.setTheme(t as any)
  success(t('theme.themeChanged', 'Tema alterado para: {theme}', { theme: t }))
}

function handleAutoDarkModeToggle(event: Event) {
  const target = event.target as HTMLInputElement
  theme.toggleAutoDarkMode()
  const status = target.checked ? t('theme.autoDarkEnabled', 'ativado') : t('theme.autoDarkDisabled', 'desativado')
  success(t('theme.autoDarkToggled', 'Modo automatico {status}', { status }))
}
</script>
