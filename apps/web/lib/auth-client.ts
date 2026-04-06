import { createAuthClient } from 'better-auth/client'

const apiBase = import.meta.env.VITE_API_BASE || 'https://pomodoro-api.azlab.dev.br'
const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID || ''

export const authClient = createAuthClient({
  baseURL: apiBase,
  socialProviders: {
    github: {
      clientId: githubClientId,
    },
  },
})
