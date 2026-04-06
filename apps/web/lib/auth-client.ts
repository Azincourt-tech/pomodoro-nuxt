import { createAuthClient, type BetterAuthClient } from 'better-auth/client'

const apiBase = 'https://pomodoro-api.azlab.dev.br'

let _client: BetterAuthClient | null = null
let _initPromise: Promise<BetterAuthClient> | null = null

export async function getAuthClient(): Promise<BetterAuthClient> {
  if (_client) return _client
  if (_initPromise) return _initPromise
  
  _initPromise = (async () => {
    // No socialProviders config here - backend handles OAuth entirely
    _client = createAuthClient({
      baseURL: apiBase,
      fetchOptions: {
        credentials: 'include', // Include cookies for cross-origin requests
      },
    })
    return _client
  })()
  
  return _initPromise
}

// For backwards compatibility - will be replaced by async getAuthClient
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
