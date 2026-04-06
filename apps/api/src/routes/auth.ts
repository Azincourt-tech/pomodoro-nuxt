import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import type { Auth } from '../services/auth'
import type { Env } from '../types/env'

const authRoutes = new Hono<{ Bindings: Env }>()

// Custom endpoint to check if GitHub OAuth is enabled
authRoutes.get('/github-enabled', (c) => {
  const clientId = c.env.GH_OAUTH_CLIENT_ID || c.env.GITHUB_CLIENT_ID
  return c.json({ enabled: !!clientId })
})

// Pass all other auth requests to Better Auth handler
authRoutes.on(['POST', 'GET', 'DELETE'], '/*', async (c) => {
  try {
    const auth = getAuth(c.env) as Auth
    return await auth.handler(c.req.raw)
  } catch (err) {
    console.error('[Auth Route] Error:', err)
    return c.json({ error: 'Internal server error', details: String(err) }, 500)
  }
})

export { authRoutes }
