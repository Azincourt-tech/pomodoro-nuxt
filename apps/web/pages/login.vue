<template>
  <div class="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
    </div>

    <!-- Main Card -->
    <div class="card bg-base-100/80 backdrop-blur-xl w-full max-w-md shadow-2xl border border-base-300/50 relative z-10">
      <div class="card-body p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg
              class="w-8 h-8 text-primary"
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
          <h1 class="text-3xl font-bold font-rajdhani text-base-content">
            {{ $t('auth.welcome', 'Bem-vindo') }}
          </h1>
          <p class="text-sm text-base-content/60 mt-2">
            {{ $t('auth.subtitle', 'Entre para sincronizar seu progresso') }}
          </p>
        </div>

        <!-- GitHub OAuth - Primary CTA -->
        <button
          class="btn btn-block gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white border-none h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          :disabled="isLoading || !githubEnabled"
          @click="handleGitHubLogin"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          <span v-else>{{ $t('auth.loginWithGitHub', 'Continuar com GitHub') }}</span>
        </button>

        <div class="divider text-xs text-base-content/40 my-6">{{ $t('auth.or', 'ou') }}</div>

        <!-- Email/Password Form -->
        <div class="space-y-4">
          <!-- Tabs -->
          <div class="tabs tabs-boxed bg-base-200/50">
            <button
              class="tab flex-1 transition-all duration-200"
              :class="{ 'tab-active': mode === 'login' }"
              @click="switchMode('login')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {{ $t('auth.signIn', 'Entrar') }}
            </button>
            <button
              class="tab flex-1 transition-all duration-200"
              :class="{ 'tab-active': mode === 'signup' }"
              @click="switchMode('signup')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {{ $t('auth.signUp', 'Criar Conta') }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name (signup only) -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="mode === 'signup'" class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ $t('auth.name', 'Nome') }}
                  </span>
                </label>
                <input
                  v-model="name"
                  type="text"
                  :placeholder="$t('auth.namePlaceholder', 'Seu nome completo')"
                  class="input input-bordered w-full focus:input-primary transition-all"
                  :disabled="isLoading"
                  :class="{ 'input-error': errors.name }"
                  @input="validateName"
                  required
                >
                <label v-if="errors.name" class="label">
                  <span class="label-text-alt text-error">{{ errors.name }}</span>
                </label>
              </div>
            </Transition>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-sm flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ $t('auth.email', 'E-mail') }}
                </span>
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="input input-bordered w-full focus:input-primary transition-all"
                :disabled="isLoading"
                :class="{ 'input-error': errors.email }"
                @input="validateEmail"
                required
              >
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>

            <!-- Password -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-sm flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {{ $t('auth.password', 'Senha') }}
                </span>
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.passwordPlaceholder', 'Sua senha')"
                  class="input input-bordered w-full pr-12 focus:input-primary transition-all"
                  :disabled="isLoading"
                  :class="{ 'input-error': errors.password }"
                  @input="validatePassword"
                  required
                >
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                  @click="showPassword = !showPassword"
                  :disabled="isLoading"
                  :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">{{ errors.password }}</span>
              </label>

              <!-- Password Strength Indicator (signup only) -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 h-0"
                enter-to-class="opacity-100 h-auto"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 h-auto"
                leave-to-class="opacity-0 h-0"
              >
                <div v-if="mode === 'signup' && password" class="mt-2 space-y-2">
                  <div class="flex gap-1">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="h-1 flex-1 rounded-full transition-all duration-300"
                      :class="{
                        'bg-error': passwordStrength <= 1 && i <= passwordStrength,
                        'bg-warning': passwordStrength === 2 && i <= passwordStrength,
                        'bg-info': passwordStrength === 3 && i <= passwordStrength,
                        'bg-success': passwordStrength === 4 && i <= passwordStrength,
                        'bg-base-300': i > passwordStrength,
                      }"
                    />
                  </div>
                  <p class="text-xs" :class="passwordStrengthColor">
                    {{ passwordStrengthText }}
                  </p>
                </div>
              </Transition>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              :disabled="isLoading || !isValid"
              :class="{ 'animate-pulse': isLoading }"
            >
              <span v-if="isLoading" class="loading loading-spinner" />
              <span v-else class="flex items-center gap-2">
                <svg v-if="mode === 'login'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {{ mode === 'login' ? $t('auth.signIn', 'Entrar') : $t('auth.signUp', 'Criar Conta') }}
              </span>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <div class="mt-6 space-y-3">
          <div class="divider text-xs text-base-content/40">{{ $t('auth.orContinue', 'ou continue sem conta') }}</div>

          <NuxtLink
            to="/"
            class="btn btn-ghost w-full h-11 text-sm group"
          >
            <span>{{ $t('auth.skip', 'Continuar sem login') }}</span>
            <svg
              class="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>

          <p class="text-center text-xs text-base-content/40">
            {{ $t('auth.optional', 'Login é opcional. O app funciona sem conta.') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Pomodoro | Login',
})

const { t } = useI18n()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string || ''
const route = useRoute()
const { login, signUp } = useAuth()
const { success, error: showError } = useToast()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const githubEnabled = ref(false)

// Validation errors
const errors = ref({
  name: '',
  email: '',
  password: '',
})

onMounted(async () => {
  try {
    const res = await $fetch<{ enabled: boolean }>(`${apiBase}/api/auth/github-enabled`)
    githubEnabled.value = res.enabled
  } catch {
    githubEnabled.value = false
  }
})

// Validation functions
function validateName() {
  if (!name.value.trim()) {
    errors.value.name = t('auth.nameRequired', 'Nome é obrigatório')
  } else if (name.value.trim().length < 2) {
    errors.value.name = t('auth.nameTooShort', 'Nome deve ter pelo menos 2 caracteres')
  } else {
    errors.value.name = ''
  }
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.value.email = t('auth.emailRequired', 'E-mail é obrigatório')
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = t('auth.emailInvalid', 'E-mail inválido')
  } else {
    errors.value.email = ''
  }
}

function validatePassword() {
  if (!password.value) {
    errors.value.password = t('auth.passwordRequired', 'Senha é obrigatória')
  } else if (mode.value === 'signup' && password.value.length < 8) {
    errors.value.password = t('auth.passwordTooShort', 'Senha deve ter pelo menos 8 caracteres')
  } else {
    errors.value.password = ''
  }
}

// Password strength
const passwordStrength = computed(() => {
  if (!password.value) return 0
  
  let strength = 0
  const hasLength = password.value.length >= 8
  const hasLower = /[a-z]/.test(password.value)
  const hasUpper = /[A-Z]/.test(password.value)
  const hasNumber = /[0-9]/.test(password.value)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password.value)
  
  if (hasLength) strength++
  if (hasLower && hasUpper) strength++
  if (hasNumber) strength++
  if (hasSpecial) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = [
    t('auth.passwordWeak', 'Muito fraca'),
    t('auth.passwordFair', 'Fraca'),
    t('auth.passwordGood', 'Boa'),
    t('auth.passwordStrong', 'Forte'),
    t('auth.passwordVeryStrong', 'Muito forte'),
  ]
  return texts[passwordStrength.value] || texts[0]
})

const passwordStrengthColor = computed(() => {
  const colors = [
    'text-error',
    'text-error',
    'text-warning',
    'text-info',
    'text-success',
  ]
  return colors[passwordStrength.value] || colors[0]
})

const isValid = computed(() => {
  if (mode.value === 'signup') {
    return name.value.trim().length >= 2 && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
           password.value.length >= 8 &&
           !errors.value.name &&
           !errors.value.email &&
           !errors.value.password
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
         password.value.length > 0 &&
         !errors.value.email &&
         !errors.value.password
})

function switchMode(newMode: 'login' | 'signup') {
  mode.value = newMode
  // Clear errors when switching modes
  errors.value = { name: '', email: '', password: '' }
}

async function handleGitHubLogin() {
  isLoading.value = true

  try {
    const res = await $fetch<{ url: string }>(`${apiBase}/api/auth/github-login`)
    navigateTo(res.url, { external: true })
  } catch {
    showError(t('auth.githubUnavailable', 'GitHub OAuth não disponível'))
    isLoading.value = false
  }
}

async function handleSubmit() {
  // Validate all fields
  if (mode.value === 'signup') {
    validateName()
  }
  validateEmail()
  validatePassword()

  // Check if there are errors
  if (errors.value.name || errors.value.email || errors.value.password) {
    showError(t('auth.fixErrors', 'Corrija os erros acima'))
    return
  }

  isLoading.value = true

  try {
    let result

    if (mode.value === 'login') {
      result = await login(email.value, password.value)
    } else {
      result = await signUp(email.value, password.value, name.value)
    }

    if (result.success) {
      success(
        mode.value === 'login'
          ? t('auth.loginSuccess', 'Login realizado com sucesso!')
          : t('auth.signupSuccess', 'Conta criada com sucesso!')
      )
      const redirect = (route.query.redirect as string) || '/'
      navigateTo(redirect)
    } else {
      showError(result.error || (mode.value === 'login' 
        ? t('auth.invalidCredentials', 'E-mail ou senha inválidos') 
        : t('auth.signupError', 'Erro ao criar conta')))
    }
  } catch {
    showError(t('auth.connectionError', 'Erro de conexão. Tente novamente.'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.input-primary {
  --input-color: hsl(var(--p) / var(--tw-border-opacity));
}
</style>
