<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Navbar - Modernized -->
    <nav
      class="navbar bg-gradient-to-r from-base-100/95 via-base-100/90 to-base-200/85 backdrop-blur-xl shadow-lg px-3 sm:px-4 lg:px-8 sticky top-0 z-50 border-b border-base-300/30"
    >
      <div class="flex-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 sm:gap-3 group"
        >
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <Icon name="lucide:timer" class="w-5 h-5 sm:w-5 sm:h-5 text-primary drop-shadow-sm" />
          </div>
          <span class="text-lg sm:text-xl font-bold font-rajdhani tracking-wide bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pomodoro</span>
        </NuxtLink>
      </div>
      <div class="flex-none">
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- History link - Mobile optimized -->
          <NuxtLink
            to="/history"
            class="btn btn-ghost btn-sm btn-circle hover:bg-base-200/60 transition-all"
            :title="$t('history.navLink')"
          >
            <Icon name="lucide:history" class="w-4 h-4" />
          </NuxtLink>

          <!-- Sound toggle - Mobile optimized -->
          <button
            class="btn btn-ghost btn-sm btn-circle hover:bg-base-200/60 transition-all"
            :title="soundEnabled ? $t('sound.enabled') : $t('sound.disabled')"
            @click="toggleSound"
          >
            <Icon v-if="soundEnabled" name="lucide:volume-2" class="w-4 h-4" />
            <Icon v-else name="lucide:volume-x" class="w-4 h-4" />
          </button>

          <!-- Shortcuts help button - Mobile optimized -->
          <button
            class="btn btn-ghost btn-sm btn-circle hover:bg-base-200/60 transition-all"
            :title="$t('shortcuts.title')"
            @click="openShortcuts"
          >
            <Icon name="lucide:keyboard" class="w-4 h-4" />
          </button>

          <!-- Language selector - Mobile optimized -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-sm btn-circle"
              :title="$t('nav.language')"
            >
              <span class="text-lg">{{ currentLocale === 'pt-BR' ? '🇧🇷' : '🇺🇸' }}</span>
            </div>
            <div
              tabindex="0"
              class="dropdown-content z-[10] mt-3 p-2 shadow-2xl bg-base-100/95 backdrop-blur-sm rounded-box w-64 border border-base-300/40"
            >
              <LanguageSelector />
            </div>
          </div>

          <!-- Theme toggle - Mobile optimized -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-sm btn-circle"
              :title="$t('nav.theme')"
            >
              <span
                class="w-5 h-5 rounded-full shadow-md ring-2 ring-base-300/50"
                :class="themePreviewColor"
              />
            </div>
            <div
              tabindex="0"
              class="dropdown-content z-[10] mt-3 p-2 shadow-2xl bg-base-100/95 backdrop-blur-sm rounded-box w-64 border border-base-300/40"
            >
              <ThemeSelector />
            </div>
          </div>

          <!-- Divider - Hidden on mobile -->
          <div class="divider divider-horizontal mx-1 h-6 my-auto hidden sm:block" />

          <!-- User profile dropdown -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-sm gap-2 px-2"
            >
              <div class="avatar">
                <div class="w-8 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-1">
                  <img
                    :src="profile.avatarUrl"
                    :alt="profile.displayName"
                  >
                </div>
              </div>
              <span class="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                {{ profile.displayName }}
              </span>
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
            <ul
              tabindex="0"
              class="dropdown-content menu bg-gradient-to-br from-base-100 via-base-100/95 to-base-200/80 backdrop-blur-xl rounded-2xl z-50 w-72 p-0 shadow-2xl border border-primary/20 mt-3 overflow-hidden"
            >
              <!-- User info header - Modernized -->
              <li class="menu-title p-0">
                <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 p-4 border-b border-base-300/30">
                  <div class="flex items-center gap-3">
                    <div class="avatar ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 rounded-full">
                      <div class="w-12 rounded-full shadow-lg">
                        <img
                          :src="profile.avatarUrl"
                          :alt="profile.displayName"
                          class="rounded-full"
                        >
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm truncate text-base-content">{{ profile.displayName }}</p>
                      <div class="flex items-center gap-1.5 mt-1">
                        <div class="badge badge-xs badge-warning font-bold shadow-md">
                          <Icon name="lucide:trophy" class="w-2.5 h-2.5" />
                        </div>
                        <span class="text-xs font-semibold text-warning">
                          {{ $t('nav.level', { level: challenges.level }) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <!-- Menu items with enhanced design -->
              <div class="p-2 space-y-1">
                <li>
                  <button @click="openEditProfile" class="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                    <Icon name="lucide:user" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('profile.editProfile') }}</span>
                  </button>
                </li>
                <li>
                  <button @click="openShare" class="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                    <Icon name="lucide:share-2" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('share.button') }}</span>
                  </button>
                </li>

                <!-- PWA Install (conditional) -->
                <li v-if="canInstall">
                  <button @click="installPwa" class="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                    <Icon name="lucide:download" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('pwa.install', 'Instalar App') }}</span>
                  </button>
                </li>

                <li>
                  <button @click="openShortcuts" class="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                    <Icon name="lucide:keyboard" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('shortcuts.title') }}</span>
                  </button>
                </li>
              </div>

              <div class="divider my-1 mx-2" />

              <!-- Login/Logout -->
              <div class="p-2">
                <li v-if="!isAuthenticated">
                  <NuxtLink to="/login" class="rounded-xl hover:bg-success/10 hover:text-success transition-all duration-200 group">
                    <Icon name="lucide:log-in" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('sync.login') }}</span>
                  </NuxtLink>
                </li>
                <li v-else>
                  <button class="text-error rounded-xl hover:bg-error/10 transition-all duration-200 group" @click="handleLogout">
                    <Icon name="lucide:log-out" class="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span class="font-medium">{{ $t('sync.logout') }}</span>
                  </button>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Experience Bar -->
    <div class="max-w-[100rem] mx-auto w-full px-4 lg:px-8 pt-4 lg:pt-6">
      <ExperienceBar />
    </div>

    <!-- Main Content -->
    <main class="max-w-[100rem] mx-auto w-full px-4 lg:px-8 pb-8 flex-1">
      <slot />
    </main>

    <!-- Footer - Modernized -->
    <footer class="bg-gradient-to-br from-base-100/80 via-base-100/70 to-base-200/60 backdrop-blur-xl border-t border-base-300/30 mt-auto">
      <div class="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <!-- Logo & Title -->
          <div class="flex items-center gap-2 text-base-content/60">
            <div class="p-1.5 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg">
              <Icon name="lucide:timer" class="w-4 h-4 text-primary" />
            </div>
            <span class="font-medium">{{ $t('app.title') }}</span>
          </div>
          
          <!-- Credits -->
          <div class="flex items-center gap-3 sm:gap-4 text-base-content/50 text-xs sm:text-sm">
            <span class="hidden sm:inline">{{ $t('footer.madeBy') }}</span>
            <a
              href="https://github.com/Azincourt-tech"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1.5 link link-hover text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Icon name="lucide:user" class="w-3.5 h-3.5" />
              Willian
            </a>
            <span class="hidden sm:inline">{{ $t('footer.and') }}</span>
            <a
              href="https://github.com/Morgana-Claw"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1.5 link link-hover text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
              Morgana
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <EditProfileModal ref="editProfileRef" />
    <ShareCard ref="shareCardRef" :stats="shareStats" />
    <ShortcutsHelp ref="shortcutsHelpRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import ThemeSelector from '~/components/atoms/ThemeSelector.vue'
import LanguageSelector from '~/components/atoms/LanguageSelector.vue'
import EditProfileModal from '~/components/molecules/EditProfileModal.vue'
import ShareCard from '~/components/molecules/ShareCard.vue'
import ShortcutsHelp from '~/components/molecules/ShortcutsHelp.vue'
import { useChallengesStore } from '~/stores/challenges'
import { useThemeStore } from '~/stores/theme'
import { useProfileStore } from '~/stores/profile'
import { useHistoryStore } from '~/stores/history'
import { useSound } from '~/composables/useSound'
import { usePwaInstall } from '~/composables/usePwaInstall'
import { useAuth, useAuthUser } from '~/composables/useAuth'

const { locale } = useI18n()
const challenges = useChallengesStore()
const theme = useThemeStore()
const profile = useProfileStore()
const history = useHistoryStore()
const currentLocale = ref(locale.value)
const { soundEnabled, toggleSound, initFromStorage: initSound } = useSound()
const { canInstall, install: installPwaNative } = usePwaInstall()
const { logout: authLogout, fetchSession } = useAuth()
const authUser = useAuthUser()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string || ''

// Refs for modals
const editProfileRef = ref<InstanceType<typeof EditProfileModal> | null>(null)
const shareCardRef = ref<InstanceType<typeof ShareCard> | null>(null)
const shortcutsHelpRef = ref<InstanceType<typeof ShortcutsHelp> | null>(null)

const isAuthenticated = computed(() => authUser.value !== null)

const shareStats = computed(() => ({
  level: challenges.level,
  xp: challenges.xp.current,
  completedChallenges: challenges.completedChallenges,
  streakCurrent: profile.streakCurrent,
  streakBest: profile.streakBest,
  totalSessions: history.totalSessions,
  totalTime: history.totalTimeMinutes,
  userName: profile.displayName,
}))

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

function openEditProfile() {
  // Close the dropdown by blurring the active element
  ;(document.activeElement as HTMLElement)?.blur()
  editProfileRef.value?.open()
}

function openShare() {
  ;(document.activeElement as HTMLElement)?.blur()
  shareCardRef.value?.open()
}

function openShortcuts() {
  ;(document.activeElement as HTMLElement)?.blur()
  shortcutsHelpRef.value?.open()
}

async function installPwa() {
  ;(document.activeElement as HTMLElement)?.blur()
  await installPwaNative()
}

async function handleLogout() {
  ;(document.activeElement as HTMLElement)?.blur()
  await authLogout()
}

async function handleGitHubLogin() {
  ;(document.activeElement as HTMLElement)?.blur()
  try {
    const res = await $fetch<{ url: string }>(`${apiBase}/api/auth/github-login`)
    navigateTo(res.url, { external: true })
  } catch {
    // GitHub OAuth not configured, fallback to login page
    navigateTo('/login')
  }
}

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('pomodoro-locale')
    if (saved && (saved === 'pt-BR' || saved === 'en')) {
      currentLocale.value = saved
    }
    initSound()
    // Try to fetch auth session
    fetchSession()
  }
})
</script>
