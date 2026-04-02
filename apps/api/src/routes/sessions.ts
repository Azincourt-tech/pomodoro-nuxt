import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import type { Env } from '../types/env'

interface PomodoroUser {
  id: string
  email: string
  name: string
}

const sessions = new Hono<{ Bindings: Env }>()

async function getUserFromSession(c: { env: Env; req: { header: (name: string) => string | undefined } }, cookieHeader?: string): Promise<PomodoroUser | null> {
  const auth = getAuth({
    DB: c.env.DB,
    BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
  })

  try {
    const headers: Record<string, string> = {}
    if (cookieHeader) {
      headers.cookie = cookieHeader
    }

    const result = await auth.api.getSession({ headers })
    if (!result) return null
    const data = result as Record<string, unknown>
    return (data.user ?? null) as PomodoroUser | null
  } catch {
    return null
  }
}

// GET /api/pomodoro/sessions - List user sessions
sessions.get('/', async (c) => {
  const cookieHeader = c.req.header('Cookie')
  const user = await getUserFromSession(c, cookieHeader ?? '')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const limit = parseInt(c.req.query('limit') ?? '20')
  const offset = parseInt(c.req.query('offset') ?? '0')

  const results = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?',
  ).bind(user.id, limit, offset).all()

  return c.json({
    sessions: results.results,
    total: results.results.length,
  })
})

// POST /api/pomodoro/sessions - Create a new session
sessions.post('/', async (c) => {
  const cookieHeader = c.req.header('Cookie')
  const user = await getUserFromSession(c, cookieHeader ?? '')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json<{
    id: string
    started_at: string
    duration_minutes: number
    challenge_type?: string | null
    challenge_desc?: string | null
    xp_gained?: number
  }>()

  await c.env.DB.prepare(`
    INSERT INTO pomodoro_sessions (id, user_id, started_at, duration_minutes, challenge_type, challenge_desc, xp_gained)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.id,
    user.id,
    body.started_at,
    body.duration_minutes,
    body.challenge_type ?? null,
    body.challenge_desc ?? null,
    body.xp_gained ?? 0,
  ).run()

  return c.json({ success: true }, 201)
})

export default sessions
