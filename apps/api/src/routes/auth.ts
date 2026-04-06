import { Hono } from 'hono'
import { getAuth } from '../services/auth'

interface Env {
  DB: D1Database
  KV: KVNamespace
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
}

export const authRoutes = new Hono<{ Bindings: Env }>()

// Check if GitHub OAuth is enabled
authRoutes.get('/github-enabled', async (c) => {
  const enabled = !!(c.env.GITHUB_CLIENT_ID && c.env.GITHUB_CLIENT_SECRET)
  return c.json({ enabled })
})
