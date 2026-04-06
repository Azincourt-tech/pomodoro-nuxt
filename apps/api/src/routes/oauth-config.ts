// API route to expose GitHub OAuth config to frontend
import { Hono } from 'hono'
import type { Env } from '../types/env'

const app = new Hono<{ Bindings: Env }>()

app.get('/config/oauth', (c) => {
  return c.json({
    githubClientId: c.env.GH_OAUTH_CLIENT_ID || c.env.GITHUB_CLIENT_ID || '',
  })
})

export default app
