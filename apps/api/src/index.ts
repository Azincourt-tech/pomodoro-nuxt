import { Hono } from 'hono'
import type { Env } from '../types/env'
import { cors } from 'hono/cors'
import profile from './routes/profile'
import sessions from './routes/sessions'
import stats from './routes/stats'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://pomodoro-move.it'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auth routes (simple token-based)
app.post('/api/auth/register', async (c) => {
  const body = await c.req.json<{ email: string; name: string; password: string }>()

  if (!body.email || !body.name || !body.password) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  // Check if user exists
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first()
  if (existing) {
    return c.json({ error: 'User already exists' }, 409)
  }

  const userId = crypto.randomUUID()
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  // Hash password (simple - in production use bcrypt or argon2)
  const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.password + body.email))
  const hashHex = Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join('')

  await c.env.DB.prepare(
    'INSERT INTO users (id, email, name) VALUES (?, ?, ?)',
  ).bind(userId, body.email, body.name).run()

  await c.env.DB.prepare(
    'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
  ).bind(crypto.randomUUID(), userId, token, expiresAt).run()

  return c.json({ token, user: { id: userId, email: body.email, name: body.name } }, 201)
})

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()

  if (!body.email || !body.password) {
    return c.json({ error: 'Missing email or password' }, 400)
  }

  const user = await c.env.DB.prepare('SELECT id, name, email FROM users WHERE email = ?').bind(body.email).first<{
    id: string; name: string; email: string
  }>()

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Verify password
  const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.password + body.email))
  const hashHex = Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join('')

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await c.env.DB.prepare(
    'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
  ).bind(crypto.randomUUID(), user.id, token, expiresAt).run()

  return c.json({ token, user })
})

app.post('/api/auth/logout', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run()
  }
  return c.json({ success: true })
})

// Pomodoro routes
app.route('/api/pomodoro/profile', profile)
app.route('/api/pomodoro/sessions', sessions)
app.route('/api/pomodoro/stats', stats)

export default app
