import { Hono } from 'hono'
import type { Env } from '../types/env'

const sessions = new Hono<{ Bindings: Env }>()

async function validateSession(c: { env: Env; req: { header: (name: string) => string | undefined } }): Promise<string | null> {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  const session = await c.env.DB.prepare(
    'SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")',
  ).bind(token).first<{ user_id: string }>()

  return session?.user_id ?? null
}

// GET /api/pomodoro/sessions - List user sessions
sessions.get('/', async (c) => {
  const userId = await validateSession(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const limit = parseInt(c.req.query('limit') ?? '20')
  const offset = parseInt(c.req.query('offset') ?? '0')

  const results = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?',
  ).bind(userId, limit, offset).all()

  return c.json({
    sessions: results.results,
    total: results.results.length,
  })
})

// POST /api/pomodoro/sessions - Create a new session
sessions.post('/', async (c) => {
  const userId = await validateSession(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json<{
    id: string
    started_at: string
    duration_minutes: number
    challenge_type?: string | null
    xp_gained?: number
  }>()

  await c.env.DB.prepare(`
    INSERT INTO pomodoro_sessions (id, user_id, started_at, duration_minutes, challenge_type, xp_gained)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    body.id,
    userId,
    body.started_at,
    body.duration_minutes,
    body.challenge_type ?? null,
    body.xp_gained ?? 0,
  ).run()

  return c.json({ success: true }, 201)
})

export default sessions
