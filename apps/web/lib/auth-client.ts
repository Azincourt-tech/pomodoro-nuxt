import { createAuthClient, type BetterAuthClient } from 'better-auth/client'

const apiBase = 'https://pomodoro-api.azlab.dev.br'

let _client: BetterAuthClient | null = null
let _initPromise: Promise<BetterAuthClient> | null = null

export async function getAuthClient(): Promise<BetterAuthClient> {
  if (_client) return _client
  if (_initPromise) return _initPromise
  
  _initPromise = (async () => {
    _client = createAuthClient({
      baseURL: apiBase,
      // No need to configure socialProviders here - handled by backend
    })
    return _client
  })()
  
  return _initPromise
}

// For backwards compatibility
export const authClient = {
  signIn: {
    social: async (options: any) => {
      const client = await getAuthClient()
      return client.signIn.social(options)
    },
    email: async (options: any) => {
      const client = await getAuthClient()
      return client.signIn.email(options)
    },
  },
  signUp: {
    email: async (options: any) => {
      const client = await getAuthClient()
      return client.signUp.email(options)
    },
  },
  signOut: async () => {
    const client = await getAuthClient()
    return client.signOut()
  },
  getSession: async () => {
    const client = await getAuthClient()
    return client.getSession()
  },
}
