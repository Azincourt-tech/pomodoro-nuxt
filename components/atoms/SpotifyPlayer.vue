<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <h3 class="font-semibold text-sm">Spotify Player</h3>
      </div>

      <!-- Input para URL -->
      <div class="form-control mb-3">
        <label class="label pb-1">
          <span class="label-text text-xs">Cole o link da playlist, album ou musica</span>
        </label>
        <div class="flex gap-2">
          <input
            v-model="inputUrl"
            type="url"
            placeholder="https://open.spotify.com/playlist/..."
            class="input input-bordered input-sm flex-1"
            @keyup.enter="saveUrl"
          />
          <button class="btn btn-sm btn-primary" @click="saveUrl" :disabled="!inputUrl.trim()">
            Usar
          </button>
        </div>
        <label class="label pt-1" v-if="savedUrl">
          <span class="label-text-alt text-success">Playlist ativa</span>
          <button class="label-text-alt link link-error" @click="clearUrl">Remover</button>
        </label>
      </div>

      <!-- Embed do Spotify - tamanho maior -->
      <div v-if="embedSrc" class="rounded-xl overflow-hidden bg-base-200">
        <iframe
          :src="embedSrc"
          style="border-radius: 12px"
          width="100%"
          height="352"
          frameBorder="0"
          allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      <!-- Placeholder quando sem playlist -->
      <div v-else class="flex flex-col items-center justify-center py-8 bg-base-200 rounded-xl">
        <svg class="w-12 h-12 text-base-content/20 mb-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <p class="text-base-content/50 text-sm text-center px-4 mb-2">
          Cole um link do Spotify para ouvir musica
        </p>
        <p class="text-base-content/30 text-xs text-center px-4">
          Para ouvir musicas completas, faca login no Spotify no navegador
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

    const type = pathParts[0] // playlist, album, track, artist
    const id = pathParts[1]

    if (!['playlist', 'album', 'track', 'artist', 'episode'].includes(type)) return ''

    // theme=0 usa o tema do sistema, view=cover mostra capa maior
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0&view=cover`
  } catch {
    return ''
  }
}

function saveUrl() {
  const url = inputUrl.value.trim()
  if (!url) return
  const embed = convertToEmbedUrl(url)
  if (!embed) return

  savedUrl.value = url
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, url)
  }
}

function clearUrl() {
  savedUrl.value = ''
  inputUrl.value = ''
  if (import.meta.client) {
    localStorage.removeItem(STORAGE_KEY)
  }
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
