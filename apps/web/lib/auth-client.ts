import { createAuthClient } from 'better-auth/client'

const apiBase = import.meta.env.VITE_API_BASE || 'https://pomodoro-api.azlab.dev.br'

export const authClient = createAuthClient({
  baseURL: apiBase,
})
