<template>
  <div class="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
    <!-- Background decorative elements with animations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl" />
    </div>

    <!-- Main Card - Modernized -->
    <div class="card bg-base-100/90 backdrop-blur-2xl w-full max-w-md shadow-2xl border border-primary/25 relative z-10 rounded-3xl">
      <div class="card-body p-8 sm:p-10">
        <!-- Header - Enhanced -->
        <div class="text-center mb-8 relative">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/15 mb-5 shadow-xl ring-4 ring-primary/10 group-hover:scale-105 transition-transform duration-500">
            <Icon name="lucide:timer" class="w-10 h-10 text-primary drop-shadow-lg" />
          </div>
          <h1 class="text-3xl font-black font-rajdhani bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {{ $t('auth.welcome', 'Bem-vindo') }}
          </h1>
          <p class="text-sm text-base-content/60 mt-2 flex items-center justify-center gap-1.5">
            <Icon name="lucide:lock" class="w-3.5 h-3.5" />
            {{ $t('auth.subtitle', 'Entre para sincronizar seu progresso') }}
          </p>
        </div>

        <!-- GitHub OAuth - Primary CTA - Enhanced -->
        <button
          class="btn btn-block gap-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-white border-none h-14 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group rounded-xl"
          :disabled="isLoading || !githubEnabled"
          @click="handleGitHubLogin"
        >
          <Icon name="lucide:github" class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span v-if="isLoading" class="loading loading-spinner loading-sm" />
          <span v-else>{{ $t('auth.loginWithGitHub', 'Continuar com GitHub') }}</span>
        </button>

        <div class="divider text-xs text-base-content/40 my-6">{{ $t('auth.or', 'ou') }}</div>

        <!-- Email/Password Form - Enhanced -->
        <div class="space-y-5">
          <!-- Tabs - Modernized -->
          <div class="tabs tabs-boxed bg-base-200/50 rounded-xl p-1.5">
            <button
              class="tab flex-1 gap-2 transition-all duration-300 font-semibold rounded-lg"
              :class="{ 'tab-active bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg': mode === 'login' }"
              @click="switchMode('login')"
            >
              <Icon name="lucide:log-in" class="w-4 h-4" />
              {{ $t('auth.signIn', 'Entrar') }}
            </button>
            <button
              class="tab flex-1 gap-2 transition-all duration-300 font-semibold rounded-lg"
              :class="{ 'tab-active bg-gradient-to-r from-success to-success/80 text-white shadow-lg': mode === 'signup' }"
              @click="switchMode('signup')"
            >
              <Icon name="lucide:user-plus" class="w-4 h-4" />
              {{ $t('auth.signUp', 'Criar Conta') }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name (signup only) -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="mode === 'signup'" class="form-control">
                <label class="label pb-1">
                  <span class="label-text font-bold text-sm flex items-center gap-2">
                    <Icon name="lucide:user" class="w-4 h-4 text-primary" />
                    {{ $t('auth.name', 'Nome') }}
                  </span>
                </label>
                <div class="relative">
                  <input
                    v-model="name"
                    type="text"
                    :placeholder="$t('auth.namePlaceholder', 'Seu nome completo')"
                    class="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm pr-10"
                    :disabled="isLoading"
                    :class="{ 'input-error': errors.name }"
                    @input="validateName"
                    required
                  >
                  <Icon v-if="!errors.name && name.length >= 2" name="lucide:check-circle" class="w-5 h-5 text-success absolute right-3 top-1/2 -translate-y-1/2" />
                  <Icon v-else-if="errors.name" name="lucide:x-circle" class="w-5 h-5 text-error absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <label v-if="errors.name" class="label pt-1">
                  <span class="label-text-alt text-error flex items-center gap-1">
                    <Icon name="lucide:alert-circle" class="w-3 h-3" />
                    {{ errors.name }}
                  </span>
                </label>
              </div>
            </Transition>

            <!-- Email - Enhanced -->
            <div class="form-control">
              <label class="label pb-1">
                <span class="label-text font-bold text-sm flex items-center gap-2">
                  <Icon name="lucide:mail" class="w-4 h-4 text-primary" />
                  {{ $t('auth.email', 'E-mail') }}
                </span>
              </label>
              <div class="relative">
                <input
                  v-model="email"
                  type="email"
                  placeholder="seu@email.com"
                  class="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm pr-10"
                  :disabled="isLoading"
                  :class="{ 'input-error': errors.email }"
                  @input="validateEmail"
                  required
                >
                <Icon v-if="!errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)" name="lucide:check-circle" class="w-5 h-5 text-success absolute right-3 top-1/2 -translate-y-1/2" />
                <Icon v-else-if="errors.email" name="lucide:x-circle" class="w-5 h-5 text-error absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <label v-if="errors.email" class="label pt-1">
                <span class="label-text-alt text-error flex items-center gap-1">
                  <Icon name="lucide:alert-circle" class="w-3 h-3" />
                  {{ errors.email }}
                </span>
              </label>
            </div>

            <!-- Password - Enhanced with Security Features -->
            <div class="form-control">
              <label class="label pb-1">
                <span class="label-text font-bold text-sm flex items-center gap-2">
                  <Icon name="lucide:shield" class="w-4 h-4 text-primary" />
                  {{ $t('auth.password', 'Senha') }}
                </span>
                <span v-if="mode === 'signup'" class="label-text-alt text-xs text-base-content/50">
                  Mín. 8 caracteres
                </span>
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="mode === 'signup' ? 'Mínimo 8 caracteres' : 'Sua senha'"
                  class="input input-bordered w-full pr-24 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-base-100/80 backdrop-blur-sm"
                  :disabled="isLoading"
                  :class="{ 'input-error': errors.password }"
                  @input="validatePassword"
                  required
                >
                <!-- Toggle visibility + strength indicator -->
                <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div v-if="mode === 'signup' && password" class="flex gap-0.5 mr-2">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="w-1.5 h-6 rounded-full transition-all duration-300"
                      :class="getStrengthBarClass(i)"
                    />
                  </div>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle hover:bg-base-200 transition-colors"
                    @click="showPassword = !showPassword"
                    :disabled="isLoading"
                    :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                  >
                    <Icon v-if="!showPassword" name="lucide:eye" class="w-4 h-4" />
                    <Icon v-else name="lucide:eye-off" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <!-- Password Strength Feedback (signup only) -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
              >
                <div v-if="mode === 'signup' && password" class="mt-2 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-medium" :class="passwordStrengthColor">
                      {{ passwordStrengthText }}
                    </span>
                    <span class="text-base-content/50">{{ passwordStrength }}/4</span>
                  </div>
                  
                  <!-- Security Tips -->
                  <div class="bg-base-200/60 rounded-lg p-3 space-y-1.5">
                    <p class="text-xs font-semibold text-base-content/70 mb-2 flex items-center gap-1">
                      <Icon name="lucide:shield-check" class="w-3.5 h-3.5" />
                      Dicas de segurança:
                    </p>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2 text-xs" :class="passwordChecks.length ? 'text-success' : 'text-base-content/40'">
                        <Icon :name="passwordChecks.length ? 'lucide:check-circle' : 'lucide:circle'" class="w-3 h-3" />
                        <span>Pelo menos 8 caracteres</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs" :class="passwordChecks.upper ? 'text-success' : 'text-base-content/40'">
                        <Icon :name="passwordChecks.upper ? 'lucide:check-circle' : 'lucide:circle'" class="w-3 h-3" />
                        <span>Letra maiúscula</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs" :class="passwordChecks.number ? 'text-success' : 'text-base-content/40'">
                        <Icon :name="passwordChecks.number ? 'lucide:check-circle' : 'lucide:circle'" class="w-3 h-3" />
                        <span>Número</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs" :class="passwordChecks.special ? 'text-success' : 'text-base-content/40'">
                        <Icon :name="passwordChecks.special ? 'lucide:check-circle' : 'lucide:circle'" class="w-3 h-3" />
                        <span>Caractere especial (!@#$%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
              
              <label v-if="errors.password" class="label pt-1">
                <span class="label-text-alt text-error flex items-center gap-1">
                  <Icon name="lucide:alert-circle" class="w-3 h-3" />
                  {{ errors.password }}
                </span>
              </label>
            </div>

            <!-- Submit Button - Enhanced -->
            <button
              type="submit"
              class="btn w-full h-14 text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 mt-6 rounded-xl group"
              :class="[mode === 'login' ? 'btn-primary' : 'btn-success', { 'animate-pulse': isLoading }]"
              :disabled="isLoading || !isValid"
            >
              <span v-if="isLoading" class="loading loading-spinner" />
              <span v-else class="flex items-center gap-2">
                <Icon v-if="mode === 'login'" name="lucide:log-in" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <Icon v-else name="lucide:user-plus" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                {{ mode === 'login' ? $t('auth.signIn', 'Entrar') : $t('auth.signUp', 'Criar Conta') }}
              </span>
            </button>
          </form>
        </div>

        <!-- Footer - Modernized -->
        <div class="mt-6 space-y-3">
          <div class="divider text-xs text-base-content/40">{{ $t('auth.orContinue', 'ou continue sem conta') }}</div>

          <NuxtLink
            to="/"
            class="btn btn-ghost w-full h-12 text-sm group rounded-xl hover:bg-base-200/50 transition-all"
          >
            <span>{{ $t('auth.skip', 'Continuar sem login') }}</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>

          <p class="text-center text-xs text-base-content/40 flex items-center justify-center gap-1.5">
            <Icon name="lucide:info" class="w-3.5 h-3.5" />
            {{ $t('auth.optional', 'Login é opcional. O app funciona sem conta.') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

// Password strength calculation
const passwordChecks = computed(() => {
  const hasLength = password.value.length >= 8
  const hasLower = /[a-z]/.test(password.value)
  const hasUpper = /[A-Z]/.test(password.value)
  const hasNumber = /[0-9]/.test(password.value)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password.value)
  
  return {
    length: hasLength,
    upper: hasUpper,
    number: hasNumber,
    special: hasSpecial,
    count: [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length,
  }
})

const passwordStrength = computed(() => {
  if (!password.value) return 0
  return passwordChecks.value.count
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
    'text-base-content/40',
    'text-error',
    'text-warning',
    'text-info',
    'text-success',
  ]
  return colors[passwordStrength.value] || colors[0]
})

function getStrengthBarClass(i: number) {
  if (i > passwordStrength.value) return 'bg-base-300'
  
  const colors = [
    'bg-error',
    'bg-warning',
    'bg-info',
    'bg-success',
  ]
  return colors[passwordStrength.value - 1] || 'bg-error'
}

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
