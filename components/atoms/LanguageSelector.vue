<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <h3 class="font-semibold text-sm">{{ $t('nav.language') }}</h3>
      </div>

      <div class="space-y-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          class="w-full flex items-baseline gap-3 px-3 py-2 rounded-lg transition-all duration-200"
          :class="currentLocale === locale.code
            ? 'bg-primary/10 ring-1 ring-primary/30'
            : 'hover:bg-base-200'"
          @click="setLocale(locale.code)"
        >
          <span class="text-xl">{{ locale.code === 'pt-BR' ? '🇧🇷' : '🇺🇸' }}</span>
          <span class="text-sm font-medium flex-1 text-left">{{ locale.name }}</span>
          <svg
            v-if="currentLocale === locale.code"
            class="w-4 h-4 text-primary self-center"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const { locales, locale, setLocale: setI18nLocale } = useI18n()

const currentLocale = ref(locale.value)

const availableLocales = computed(() => {
  return locales.value as Array<{ code: string; name: string }>
})

function setLocale(code: string) {
  currentLocale.value = code
  setI18nLocale(code)
  if (import.meta.client) {
    localStorage.setItem('pomodoro-locale', code)
  }
}

// Keep local state in sync if i18n locale changes from elsewhere
watch(locale, (newLocale) => {
  if (currentLocale.value !== newLocale) {
    currentLocale.value = newLocale
  }
})

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('pomodoro-locale')
    if (saved && availableLocales.value.some(l => l.code === saved)) {
      setLocale(saved)
    }
  }
})
</script>
