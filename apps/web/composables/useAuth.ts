import type { Ref } from 'vue'
import { getAuthClient } from '~/lib/auth-client'

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
  const { signInWithGitHub } = useBetterAuthSocial()
  const { login, signUp, logout, fetchSession } = useBetterAuthEmail()

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

function useBetterAuthSocial() {
  async function signInWithGitHub(): Promise<void> {
    try {
      // Use Better Auth client which handles the full OAuth flow
      const client = await getAuthClient()
      
      await client.signIn.social({
        provider: 'github',
        callbackURL: window.location.origin,
      })
    } catch (err) {
      console.error('GitHub OAuth error:', err)
      throw new Error('GitHub OAuth failed')
    }
  }

  return { signInWithGitHub }
}

function useBetterAuthEmail() {
  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = await getAuthClient()
      const res = await client.signIn.email({
        email,
        password,
      })

      if (!res.data?.user) {
        return { success: false, error: 'Credenciais inválidas' }
      }

      const user = res.data.user as any
      authUser.value = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image || null,
      }
      authSession.value = res.data.session as any
      return { success: true }
    } catch (err: unknown) {
      const error = err as { message?: string }
      return { success: false, error: error.message || 'Erro de conexão' }
    }
  }

  async function signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = await getAuthClient()
      const res = await client.signUp.email({
        email,
        password,
        name,
      })

      if (!res.data?.user) {
        return { success: false, error: 'Erro ao criar conta' }
      }

      const user = res.data.user as any
      authUser.value = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image || null,
      }
      authSession.value = res.data.session as any
      return { success: true }
    } catch (err: unknown) {
      const error = err as { message?: string }
      if (error.message?.includes('duplicate') || error.message?.includes('UNIQUE')) {
        return { success: false, error: 'Email já cadastrado' }
      }
      return { success: false, error: error.message || 'Erro ao criar conta' }
    }
  }

  async function logout(): Promise<void> {
    const client = await getAuthClient()
    try {
      await client.signOut()
    } catch {
      // Idempotent
    }
    authUser.value = null
    authSession.value = null
    navigateTo('/login')
  }

  async function fetchSession(): Promise<void> {
    const client = await getAuthClient()
    if (authInitialized.value) return

    try {
      const res = await client.getSession()
      if (res.data?.user) {
        const user = res.data.user as any
        authUser.value = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.image || null,
        }
        authSession.value = res.data.session as any
      } else {
        authUser.value = null
        authSession.value = null
      }
    } catch {
      authUser.value = null
      authSession.value = null
    } finally {
      authLoading.value = false
      authInitialized.value = true
    }
  }

  return { login, signUp, logout, fetchSession }
}
