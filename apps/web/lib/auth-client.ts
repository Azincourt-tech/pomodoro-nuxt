import { createAuthClient } from 'better-auth/client'

const apiBase = import.meta.env.VITE_API_BASE || 'https://pomodoro-api.azlab.dev.br'

let _client: ReturnType<typeof createAuthClient> | null = null

export function getAuthClient(githubClientId?: string) {
  if (_client) return _client
  
  _client = createAuthClient({
    baseURL: apiBase,
    socialProviders: githubClientId ? {
      github: {
        clientId: githubClientId,
      },
    } : undefined,
  })
  
  return _client
}

export const authClient = getAuthClient()
