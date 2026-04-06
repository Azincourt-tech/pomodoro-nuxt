import { createAuthClient, type BetterAuthClient } from 'better-auth/client'

const apiBase = 'https://pomodoro-api.azlab.dev.br'

let _client: BetterAuthClient | null = null
let _clientId: string | null = null
let _initPromise: Promise<BetterAuthClient> | null = null

async function fetchGithubClientId(): Promise<string> {
  if (_clientId !== null) return _clientId
  
  try {
    const res = await fetch(`${apiBase}/api/config/oauth`)
    const data = await res.json()
    _clientId = data.githubClientId || ''
  } catch {
    _clientId = ''
  }
  
  return _clientId
}

export async function getAuthClient(): Promise<BetterAuthClient> {
  if (_client) return _client
  if (_initPromise) return _initPromise
  
  _initPromise = (async () => {
    const githubClientId = await fetchGithubClientId()
    
    _client = createAuthClient({
      baseURL: apiBase,
      ...(githubClientId ? {
        socialProviders: {
          github: {
            clientId: githubClientId,
          },
        },
      } : {}),
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
