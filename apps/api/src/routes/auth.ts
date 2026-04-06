import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import type { Auth } from '../services/auth'
import type { Env } from '../types/env'

const authRoutes = new Hono<{ Bindings: Env }>()

// Override sign-in social to create pomodoro profile after successful social login
authRoutes.post('/sign-in/social', async (c) => {
  const auth = getAuth(c.env) as Auth
  return auth.handler(c.req.raw)
})

// Override callback to handle profile creation
authRoutes.get('/callback/:provider', async (c) => {
  const auth = getAuth(c.env) as Auth
  const response = await auth.handler(c.req.raw)
  
  // After successful callback, the user is authenticated
  // We need to ensure their pomodoro profile exists
  // For now, just return the auth response - profile will be created on first access
  return response
})

// Handle all other auth endpoints
authRoutes.on(['POST', 'GET'], '/*', async (c) => {
  const auth = getAuth(c.env) as Auth
  return auth.handler(c.req.raw)
})

export { authRoutes }
