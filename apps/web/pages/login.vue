<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center px-4">
    <!-- Navbar simplificada -->
    <div class="fixed top-0 left-0 right-0 navbar bg-base-200/95 backdrop-blur-sm shadow-sm z-50 px-6">
      <div class="flex-1">
        <NuxtLink to="/" class="text-xl font-bold font-rajdhani text-primary flex items-center gap-2">
          <svg
            class="w-6 h-6 text-primary"
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
          Pomodoro
        </NuxtLink>
      </div>
    </div>

    <div class="card bg-base-200 w-full max-w-sm shadow-lg mt-16">
      <div class="card-body">
        <!-- GitHub OAuth - Primary option -->
        <button
          class="btn btn-block gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white border-none"
          :disabled="isLoading || !githubEnabled"
          @click="handleGitHubLogin"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          <span v-else>{{ $t('auth.loginWithGitHub', 'Entrar com GitHub') }}</span>
        </button>

        <div class="divider text-xs">{{ $t('auth.or', 'ou') }}</div>

        <!-- Email/Password - Secondary option -->
        <div class="collapse collapse-arrow bg-base-300/50">
          <input type="checkbox" v-model="showEmailForm" />
          <div class="collapse-title text-sm font-medium min-h-0 py-3">
            {{ $t('auth.emailPassword', 'Entrar com E-mail e Senha') }}
          </div>
          <div class="collapse-content px-4">
            <!-- Tabs -->
            <div class="tabs tabs-boxed justify-center mb-3">
              <button
                class="tab tab-sm"
                :class="{ 'tab-active': mode === 'login' }"
                @click="mode = 'login'"
              >
                {{ $t('auth.signIn', 'Entrar') }}
              </button>
              <button
                class="tab tab-sm"
                :class="{ 'tab-active': mode === 'signup' }"
                @click="mode = 'signup'"
              >
                {{ $t('auth.signUp', 'Criar Conta') }}
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
              <!-- Name (signup only) -->
              <div v-if="mode === 'signup'" class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-xs">
                    {{ $t('auth.name', 'Nome') }} <span class="text-error">*</span>
                  </span>
                </label>
                <input
                  v-model="name"
                  type="text"
                  :placeholder="$t('auth.namePlaceholder', 'Seu nome')"
                  class="input input-bordered input-sm w-full"
                  :disabled="isLoading"
                  required
                >
              </div>

              <!-- Email -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-xs">
                    {{ $t('auth.email', 'E-mail') }} <span class="text-error">*</span>
                  </span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="seu@email.com"
                  class="input input-bordered input-sm w-full"
                  :disabled="isLoading"
                  required
                >
              </div>

              <!-- Password -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-xs">
                    {{ $t('auth.password', 'Senha') }} <span class="text-error">*</span>
                  </span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="$t('auth.passwordPlaceholder', 'Sua senha')"
                    class="input input-bordered input-sm w-full pr-10"
                    :disabled="isLoading"
                    required
                  >
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    @click="showPassword = !showPassword"
                    :disabled="isLoading"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div v-if="error" class="alert alert-error text-xs py-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ error }}</span>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="btn btn-primary btn-sm w-full"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading loading-spinner loading-sm" />
                <span v-else>{{ mode === 'login' ? $t('auth.signIn', 'Entrar') : $t('auth.signUp', 'Criar Conta') }}</span>
              </button>
            </form>
          </div>
        </div>

        <p class="text-center text-base-content/50 text-xs mt-2">
          {{ $t('auth.optional', 'Login é opcional. O app funciona sem conta.') }}
        </p>

        <div class="divider text-xs">{{ $t('auth.orContinue', 'ou continue sem conta') }}</div>

        <NuxtLink to="/" class="btn btn-ghost btn-sm w-full">
          {{ $t('auth.skip', 'Continuar sem login') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Pomodoro | Login',
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string || ''
const route = useRoute()
const { login, signUp } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)
const showEmailForm = ref(false)
const isLoading = ref(false)
const error = ref('')
const githubEnabled = ref(false)

onMounted(async () => {
  try {
    const res = await $fetch<{ enabled: boolean }>(`${apiBase}/api/auth/github-enabled`)
    githubEnabled.value = res.enabled
  } catch {
    githubEnabled.value = false
  }
})

async function handleGitHubLogin() {
  isLoading.value = true
  error.value = ''

  try {
    const res = await $fetch<{ url: string }>(`${apiBase}/api/auth/github-login`)
    navigateTo(res.url, { external: true })
  } catch {
    error.value = 'GitHub OAuth não disponível'
    isLoading.value = false
  }
}

async function handleSubmit() {
  error.value = ''
  isLoading.value = true

  try {
    let result

    if (mode.value === 'login') {
      result = await login(email.value, password.value)
    } else {
      result = await signUp(email.value, password.value, name.value)
    }

    if (result.success) {
      const redirect = (route.query.redirect as string) || '/'
      navigateTo(redirect)
    } else {
      error.value = result.error || (mode.value === 'login' ? 'Credenciais inválidas' : 'Erro ao criar conta')
    }
  } catch {
    error.value = 'Erro de conexão'
  } finally {
    isLoading.value = false
  }
}
</script>
