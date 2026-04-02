<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Navbar -->
    <nav
      class="navbar bg-base-100/80 backdrop-blur-md shadow-sm px-4 lg:px-8 sticky top-0 z-50 border-b border-base-300/50"
    >
      <div class="flex-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 group"
        >
          <div
            class="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"
          >
            <svg
              class="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold font-rajdhani tracking-wide">Pomodoro</span>
        </NuxtLink>
      </div>
      <div class="flex-none">
        <div class="flex items-center gap-3">
          <!-- History link -->
          <NuxtLink
            to="/history"
            class="btn btn-ghost btn-sm gap-2"
            :title="$t('history.navLink')"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="hidden sm:inline text-xs font-medium">{{ $t('history.navLink') }}</span>
          </NuxtLink>

          <!-- Sound toggle -->
          <button
            class="btn btn-ghost btn-sm"
            :title="soundEnabled ? $t('sound.enabled') : $t('sound.disabled')"
            @click="toggleSound"
          >
            <svg
              v-if="soundEnabled"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          </button>

          <!-- Level badge -->
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-full">
            <svg
              class="w-4 h-4 text-warning"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span class="text-sm font-semibold">{{
              $t('nav.level', { level: challenges.level })
            }}</span>
          </div>

          <!-- Language selector -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-sm gap-2 items-baseline"
              :title="$t('nav.language')"
            >
              <span class="text-lg">{{ currentLocale === 'pt-BR' ? '\u{1F1E7}\u{1F1F7}' : '\u{1F1FA}\u{1F1F8}' }}</span>
              <span class="hidden sm:inline text-xs font-medium">{{
                currentLocale === 'pt-BR' ? 'PT' : 'EN'
              }}</span>
              <svg
                class="w-3 h-3 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div
              tabindex="0"
              class="dropdown-content z-[10] mt-3 p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-300/50"
            >
              <LanguageSelector />
            </div>
          </div>

          <!-- Theme toggle - clearly visible -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-sm gap-2"
              :title="$t('nav.theme')"
            >
              <span
                class="w-5 h-5 rounded-full shadow-sm ring-1 ring-base-300"
                :class="themePreviewColor"
              />
              <span class="hidden sm:inline text-xs font-medium capitalize">{{
                theme.currentTheme
              }}</span>
              <svg
                class="w-3 h-3 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div
              tabindex="0"
              class="dropdown-content z-[10] mt-3 p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-300/50"
            >
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Experience Bar -->
    <div class="max-w-7xl mx-auto w-full px-4 lg:px-8 pt-4 lg:pt-6">
      <ExperienceBar />
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-8 flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-base-100/50 border-t border-base-300/50 mt-auto">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div class="flex items-center gap-2 text-base-content/50">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ $t('app.title') }}</span>
          </div>
          <div class="flex items-center gap-4 text-base-content/40">
            <span>{{ $t('footer.madeBy') }}</span>
            <a
              href="https://github.com/Azincourt-tech"
              target="_blank"
              rel="noopener"
              class="link link-hover text-primary font-medium"
            >
              Willian
            </a>
            <span>e</span>
            <a
              href="https://github.com/Morgana-Claw"
              target="_blank"
              rel="noopener"
              class="link link-hover text-primary font-medium"
            >
              Morgana
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import ThemeSelector from '~/components/atoms/ThemeSelector.vue'
import LanguageSelector from '~/components/atoms/LanguageSelector.vue'
import { useChallengesStore } from '~/stores/challenges'
import { useThemeStore } from '~/stores/theme'
import { useSound } from '~/composables/useSound'

const { locale } = useI18n()
const challenges = useChallengesStore()
const theme = useThemeStore()
const currentLocale = ref(locale.value)
const { soundEnabled, toggleSound, initFromStorage: initSound } = useSound()

// Sync navbar locale display with i18n changes
watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})

const colorMap: Record<string, string> = {
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

const themePreviewColor = computed(() => colorMap[theme.currentTheme] || 'bg-gray-400')

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('pomodoro-locale')
    if (saved && (saved === 'pt-BR' || saved === 'en')) {
      currentLocale.value = saved
    }
    initSound()
  }
})
</script>
