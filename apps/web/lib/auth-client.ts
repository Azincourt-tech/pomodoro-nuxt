import { createAuthClient } from 'better-auth/client'

const apiBase = import.meta.env.VITE_API_BASE || 'https://pomodoro-api.azlab.dev.br'

// GitHub OAuth Client ID - set via NUXT_PUBLIC_GITHUB_CLIENT_ID env var
// In Nuxt, public runtime config vars are available via process.env at build time
const githubClientId = process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID || ''

let _client: ReturnType<typeof createAuthClient> | null = null

export function getAuthClient() {
  if (_client) return _client
  
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
}

export const authClient = getAuthClient()
