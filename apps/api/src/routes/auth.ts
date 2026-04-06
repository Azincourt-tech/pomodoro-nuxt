import { Hono } from 'hono'
import { getAuth } from '../services/auth'

interface Env {
  DB: D1Database
  KV: KVNamespace
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GH_OAUTH_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GH_OAUTH_CLIENT_SECRET?: string
}

export const authRoutes = new Hono<{ Bindings: Env }>()

// Check if GitHub OAuth is enabled
authRoutes.get('/github-enabled', async (c) => {
  const clientId = c.env.GH_OAUTH_CLIENT_ID || c.env.GITHUB_CLIENT_ID
  const clientSecret = c.env.GITHUB_CLIENT_SECRET || c.env.GH_OAUTH_CLIENT_SECRET
  const enabled = !!(clientId && clientSecret)
  return c.json({ enabled })
})
