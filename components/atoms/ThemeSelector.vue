<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
      <span class="hidden sm:inline text-xs">Theme</span>
      <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <ul tabindex="0" class="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-box w-52 max-h-80 overflow-y-auto">
      <li v-for="t in themes" :key="t">
        <button :class="{ active: theme.currentTheme === t }" @click="theme.setTheme(t)">
          <span class="w-4 h-4 rounded-full shrink-0" :class="previewColor(t)" />
          <span class="capitalize">{{ t }}</span>
          <svg v-if="theme.currentTheme === t" class="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore, AVAILABLE_THEMES } from '~/stores/theme'

const theme = useThemeStore()
const themes = AVAILABLE_THEMES

function previewColor(t: string) {
  const map: Record<string, string> = {
    light: 'bg-gray-100 border border-gray-300',
    dark: 'bg-gray-900',
    cupcake: 'bg-pink-200',
    dracula: 'bg-purple-900',
    synthwave: 'bg-fuchsia-600',
    retro: 'bg-orange-200',
    cyberpunk: 'bg-yellow-400',
    valentine: 'bg-pink-400',
    aqua: 'bg-cyan-400',
    lofi: 'bg-gray-300',
  }
  return map[t] || 'bg-gray-400'
}
</script>
