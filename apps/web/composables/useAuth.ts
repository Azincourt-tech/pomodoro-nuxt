import type { Ref } from 'vue'
import { authClient } from '~/lib/auth-client'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  githubUsername?: string | null
}

export interface AuthSession {
  id: string
  expiresAt: string
}

const authUser = ref<AuthUser | null>(null) as Ref<AuthUser | null>
const authSession = ref<AuthSession | null>(null) as Ref<AuthSession | null>
const authLoading = ref(true)
const authInitialized = ref(false)

export function useAuthUser() {
  return authUser
}

export function useAuthSession() {
  return authSession
}

export function useAuthLoading() {
  return authLoading
}

export function useAuth() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string || ''

  async function signInWithGitHub(): Promise<void> {
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: window.location.origin,
      })
      // Better Auth handles the redirect automatically
    } catch (err) {
      console.error('GitHub OAuth error:', err)
      throw new Error('GitHub OAuth failed')
    }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await $fetch<{ user: AuthUser; session: AuthSession } | { error: string }>(
        `${apiBase}/api/auth/sign-in`,
        {
          method: 'POST',
          body: { email, password },
          credentials: 'include',
        },
      )

      if ('error' in res) {
        return { success: false, error: res.error }
      }

      authUser.value = res.user
      authSession.value = res.session
      return { success: true }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string }; message?: string }
      if (error.data?.error) {
        return { success: false, error: error.data.error }
      }
      return { success: false, error: 'Erro de conexão' }
    }
  }

  async function signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await $fetch<{ user: AuthUser; session: AuthSession } | { error: string }>(
        `${apiBase}/api/auth/sign-up`,
        {
          method: 'POST',
          body: { email, password, name },
          credentials: 'include',
        },
      )

      if ('error' in res) {
        return { success: false, error: res.error }
      }

      authUser.value = res.user
      authSession.value = res.session
      return { success: true }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string }; message?: string }
      if (error.data?.error) {
        return { success: false, error: error.data.error }
      }
      return { success: false, error: 'Erro de conexão' }
    }
  }

  async function logout(): Promise<void> {
    try {
      await $fetch(`${apiBase}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Idempotent
    }
    authUser.value = null
    authSession.value = null
    navigateTo('/login')
  }

  async function fetchSession(): Promise<void> {
    if (authInitialized.value) return

    try {
      const res = await $fetch<{ user: AuthUser; session: AuthSession }>(
        `${apiBase}/api/auth/session`,
        {
          credentials: 'include',
        },
      )
      authUser.value = res.user
      authSession.value = res.session
    } catch {
      authUser.value = null
      authSession.value = null
    } finally {
      authLoading.value = false
      authInitialized.value = true
    }
  }

  function isAuthenticated(): boolean {
    return authUser.value !== null
  }

  function isGitHubUser(): boolean {
    return !!authUser.value?.githubUsername
  }

  return {
    user: authUser,
    session: authSession,
    loading: authLoading,
    login,
    signUp,
    logout,
    fetchSession,
    isAuthenticated,
    isGitHubUser,
    signInWithGitHub,
  }
}
