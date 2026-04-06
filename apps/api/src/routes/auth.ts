import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import type { Auth } from '../services/auth'
import type { Env } from '../types/env'

const authRoutes = new Hono<{ Bindings: Env }>()

// Pass all auth requests to Better Auth handler
authRoutes.on(['POST', 'GET', 'DELETE'], '/*', async (c) => {
  const auth = getAuth(c.env) as Auth
  return auth.handler(c.req.raw)
})

export { authRoutes }
