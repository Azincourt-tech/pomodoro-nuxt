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
        <!-- Tabs -->
        <div class="tabs tabs-boxed justify-center mb-4">
          <button
            class="tab"
            :class="{ 'tab-active': mode === 'login' }"
            @click="mode = 'login'"
          >
            {{ $t('auth.signIn', 'Entrar') }}
          </button>
          <button
            class="tab"
            :class="{ 'tab-active': mode === 'signup' }"
            @click="mode = 'signup'"
          >
            {{ $t('auth.signUp', 'Criar Conta') }}
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <!-- Name (signup only) -->
          <div v-if="mode === 'signup'" class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{ $t('auth.name', 'Nome') }} <span class="text-error">*</span>
              </span>
            </label>
            <input
              v-model="name"
              type="text"
              :placeholder="$t('auth.namePlaceholder', 'Seu nome')"
              class="input input-bordered w-full"
              :disabled="isLoading"
              required
            >
          </div>

          <!-- Email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{ $t('auth.email', 'E-mail') }} <span class="text-error">*</span>
              </span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              class="input input-bordered w-full"
              :disabled="isLoading"
              required
            >
          </div>

          <!-- Password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{ $t('auth.password', 'Senha') }} <span class="text-error">*</span>
              </span>
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('auth.passwordPlaceholder', 'Sua senha')"
                class="input input-bordered w-full pr-10"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="alert alert-error text-sm py-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{{ error }}</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-sm" />
            <span v-else>{{ mode === 'login' ? $t('auth.signIn', 'Entrar') : $t('auth.signUp', 'Criar Conta') }}</span>
          </button>
        </form>

        <p class="text-center text-base-content/50 text-xs mt-4">
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

const route = useRoute()
const { login, signUp } = useAuth()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

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
