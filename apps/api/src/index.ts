import { Hono } from 'hono'
import type { Env } from './types/env'
import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { getAuth } from './services/auth'
import profile from './routes/profile'
import sessions from './routes/sessions'
import stats from './routes/stats'
import { authRoutes } from './routes/auth'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://pomodoro-nuxt-ten.vercel.app', 'https://pomodoro-move.it'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
}))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Custom auth routes (sign-in, sign-up, sign-out, session, github-enabled, github-login)
app.route('/api/auth', authRoutes)

// Better Auth handler for OAuth flows (GitHub OAuth signin/callback)
// Mounts at /api/better-auth/* to avoid conflicts with custom routes
app.all('/api/better-auth/*', async (c) => {
  const auth = getAuth({
    DB: c.env.DB,
    BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: c.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: c.env.GITHUB_CLIENT_SECRET,
  })

  return auth.handler(c.req.raw)
})

// Pomodoro routes
app.route('/api/pomodoro/profile', profile)
app.route('/api/pomodoro/sessions', sessions)
app.route('/api/pomodoro/stats', stats)

export default app
// deploy test
// dominio personalizado
// teste final deploy
