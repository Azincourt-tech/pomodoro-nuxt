<template>
  <div
    class="card bg-gradient-to-br from-base-100/95 via-base-100/90 to-base-200/80 backdrop-blur-xl shadow-2xl border border-success/20 hover:shadow-[0_25px_60px_rgba(30,215,96,0.25)] hover:border-success/40 transition-all duration-500 hover:-translate-y-1 h-full group relative overflow-hidden"
    v-bind="$attrs"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-success/10 rounded-full blur-3xl group-hover:bg-success/15 transition-all duration-700" />
      <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-all duration-700" />
    </div>
    
    <div class="card-body p-5 flex flex-col gap-3 [&>p]:flex-none relative z-10">
      <!-- Header with gradient icon -->
      <div class="flex items-center gap-3 mb-1">
        <div class="p-2.5 bg-gradient-to-br from-success/20 to-success/5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon name="lucide:music" class="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 class="font-bold text-base bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">
            {{ $t('spotify.player') }}
          </h3>
          <p class="text-xs text-base-content/50">{{ $t('spotify.sub', 'Sua trilha sonora') }}</p>
        </div>
      </div>

      <!-- Input with enhanced design -->
      <div class="relative mb-1">
        <div class="absolute inset-0 bg-gradient-to-r from-success/5 to-success/10 rounded-xl blur-lg -z-10" />
        <div class="bg-base-200/50 backdrop-blur-sm rounded-xl p-3 border border-success/15">
          <div class="flex gap-2">
            <input
              v-model="inputUrl"
              type="url"
              :placeholder="$t('spotify.playlistLink')"
              class="input input-bordered input-sm flex-1 focus:border-success focus:ring-2 focus:ring-success/30 transition-all bg-base-100/80 backdrop-blur-sm placeholder:text-base-content/40"
              @keyup.enter="saveUrl"
            >
            <button
              class="btn btn-sm btn-success shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
              :disabled="!inputUrl.trim()"
              @click="saveUrl"
            >
              <Icon name="lucide:check" class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span class="hidden sm:inline">{{ $t('spotify.use') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active playlist status -->
      <div
        v-if="savedUrl"
        class="flex items-center justify-between text-xs bg-gradient-to-r from-success/10 to-success/5 px-3 py-2 rounded-lg border border-success/25"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:check" class="w-3.5 h-3.5 text-success" />
          <span class="font-medium text-success">{{ $t('spotify.activePlaylist') }}</span>
        </div>
        <button
          class="btn btn-ghost btn-xs text-error hover:bg-error/10 hover:text-error transition-all"
          @click="clearUrl"
        >
          <Icon name="lucide:x" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('spotify.remove') }}</span>
        </button>
      </div>

      <!-- Login info note -->
      <div
        class="flex items-start gap-2 p-3 text-xs bg-info/5 text-info/80 rounded-lg border border-info/15"
      >
        <Icon name="lucide:info" class="w-4 h-4 flex-shrink-0 mt-0.5 text-info" />
        <span class="leading-relaxed">{{ $t('spotify.loginInfo') }}</span>
      </div>

      <!-- Embed player with glow -->
      <div
        v-if="embedSrc"
        class="relative rounded-2xl overflow-hidden flex-1 min-h-[352px] shadow-2xl border border-success/20 group/player"
      >
        <!-- Glow effect around player -->
        <div class="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-2xl blur-2xl -z-10 group-hover/player:from-success/30 group-hover/player:to-success/10 transition-all duration-700" />
        <iframe
          :src="embedSrc"
          width="100%"
          height="100%"
          style="min-height: 250px"
          frameBorder="0"
          allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          class="rounded-2xl relative z-10"
        />
      </div>

      <!-- Empty state with enhanced design -->
      <div
        v-else
        class="flex items-center justify-center flex-1 bg-gradient-to-br from-base-200/60 to-base-300/40 rounded-2xl border-2 border-dashed border-success/20 hover:border-success/40 transition-all duration-300 group/empty min-h-[180px]"
      >
        <div class="flex flex-col items-center gap-3 p-4">
          <div class="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-full shadow-lg group-hover/empty:scale-110 transition-transform duration-500">
            <Icon name="lucide:music" class="w-10 h-10 text-success/40 group-hover/empty:text-success/60 transition-colors" />
          </div>
          <p class="text-base-content/50 text-sm text-center font-medium">
            {{ $t('spotify.pasteLink') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const { success, info, error } = useToast()

const STORAGE_KEY = 'pomodoro-spotify-url'
const inputUrl = ref('')
const savedUrl = ref('')

const embedSrc = computed(() => {
  if (!savedUrl.value) return ''
  return convertToEmbedUrl(savedUrl.value)
})

function convertToEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('spotify.com')) return ''

    const pathParts = parsed.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) return ''

    const type = pathParts[0]
    const id = pathParts[1]

    if (!['playlist', 'album', 'track', 'artist', 'episode'].includes(type)) return ''

    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0&view=cover`
  }
  catch {
    return ''
  }
}

function saveUrl() {
  const url = inputUrl.value.trim()
  if (!url) return
  const embed = convertToEmbedUrl(url)
  if (!embed) {
    error(t('spotify.invalidUrl', 'URL do Spotify inválida'))
    return
  }

  savedUrl.value = url
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, url)
  }
  success(t('spotify.playlistSaved', 'Playlist salva! 🎵'))
}

function clearUrl() {
  savedUrl.value = ''
  inputUrl.value = ''
  if (import.meta.client) {
    localStorage.removeItem(STORAGE_KEY)
  }
  info(t('spotify.playlistRemoved', 'Playlist removida'))
}

onMounted(() => {
  if (import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      savedUrl.value = stored
      inputUrl.value = stored
    }
  }
})
</script>
