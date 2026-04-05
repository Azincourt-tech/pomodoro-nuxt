<template>
  <div class="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-base-300/40 hover:shadow-2xl transition-all duration-300">
    <div class="card-body p-5">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-secondary/10 rounded-lg">
          <Icon name="lucide:languages" class="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 class="font-bold text-base">{{ $t('nav.language') }}</h3>
          <p class="text-xs text-base-content/50">Selecione o idioma</p>
        </div>
      </div>

      <!-- Language Options -->
      <div class="space-y-2">
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-0.5"
          :class="
            currentLocale === loc.code
              ? 'bg-gradient-to-r from-primary/15 to-secondary/15 ring-2 ring-primary shadow-lg'
              : 'bg-base-200/50 hover:bg-base-200/70 hover:shadow-lg'
          "
          @click="setLocale(loc.code)"
        >
          <!-- Flag -->
          <div class="text-4xl filter drop-shadow-lg group-hover:scale-125 transition-transform duration-300">
            {{ loc.code === 'pt-BR' ? '🇧🇷' : '🇺🇸' }}
          </div>
          
          <!-- Language Info -->
          <div class="flex-1 text-left">
            <p class="font-semibold text-sm">{{ loc.name }}</p>
            <p class="text-xs text-base-content/50">{{ loc.code === 'pt-BR' ? 'Português Brasileiro' : 'English' }}</p>
          </div>
          
          <!-- Checkmark -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="scale-0 opacity-0"
            enter-to-class="scale-100 opacity-100"
          >
            <div
              v-if="currentLocale === loc.code"
              class="bg-primary rounded-full p-1"
            >
              <svg
                class="w-4 h-4 text-primary-content"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </Transition>
        </button>
      </div>

      <!-- Info Note -->
      <div class="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
        <p class="text-xs text-base-content/60 flex items-start gap-2">
          <Icon name="lucide:info" class="w-4 h-4 text-info shrink-0 mt-0.5" />
          <span>{{ $t('language.info', 'Idioma salvo automaticamente') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const { locales, locale, setLocale: setI18nLocale } = useI18n()
const { success } = useToast()

const currentLocale = ref(locale.value)

const availableLocales = computed(() => {
  return locales.value as Array<{ code: string, name: string }>
})

function setLocale(code: string) {
  currentLocale.value = code
  setI18nLocale(code)
  if (import.meta.client) {
    localStorage.setItem('pomodoro-locale', code)
  }
  success(t('language.changed', 'Idioma alterado para: {name}', { name: code === 'pt-BR' ? 'Português' : 'English' }))
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
