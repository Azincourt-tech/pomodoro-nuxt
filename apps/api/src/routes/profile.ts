import { Hono } from 'hono'
import type { Env } from '../types/env'

const profile = new Hono<{ Bindings: Env }>()

// GET /api/pomodoro/profile - Get user profile
profile.get('/', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')

  // Validate session
  const session = await c.env.DB.prepare(
    'SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")',
  ).bind(token).first<{ user_id: string }>()

  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  const profile = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(session.user_id).first()

  if (!profile) {
    return c.json({
      user_id: session.user_id,
      level: 1,
      xp_current: 0,
      xp_start: 0,
      xp_end: 64,
      streak_current: 0,
      streak_best: 0,
      completed_challenges: 0,
      last_session_date: null,
    })
  }

  return c.json(profile)
})

// POST /api/pomodoro/profile - Update user profile
profile.post('/', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')

  const session = await c.env.DB.prepare(
    'SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")',
  ).bind(token).first<{ user_id: string }>()

  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  const body = await c.req.json<{
    level?: number
    xp_current?: number
    xp_start?: number
    xp_end?: number
    streak_current?: number
    streak_best?: number
    completed_challenges?: number
    last_session_date?: string | null
  }>()

  const existing = await c.env.DB.prepare(
    'SELECT user_id FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(session.user_id).first()

  if (existing) {
    await c.env.DB.prepare(`
      UPDATE pomodoro_profiles SET
        level = COALESCE(?, level),
        xp_current = COALESCE(?, xp_current),
        xp_start = COALESCE(?, xp_start),
        xp_end = COALESCE(?, xp_end),
        streak_current = COALESCE(?, streak_current),
        streak_best = COALESCE(?, streak_best),
        completed_challenges = COALESCE(?, completed_challenges),
        last_session_date = COALESCE(?, last_session_date),
        updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(
      body.level ?? null,
      body.xp_current ?? null,
      body.xp_start ?? null,
      body.xp_end ?? null,
      body.streak_current ?? null,
      body.streak_best ?? null,
      body.completed_challenges ?? null,
      body.last_session_date ?? null,
      session.user_id,
    ).run()
  }
  else {
    await c.env.DB.prepare(`
      INSERT INTO pomodoro_profiles
        (user_id, level, xp_current, xp_start, xp_end, streak_current, streak_best, completed_challenges, last_session_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.user_id,
      body.level ?? 1,
      body.xp_current ?? 0,
      body.xp_start ?? 0,
      body.xp_end ?? 64,
      body.streak_current ?? 0,
      body.streak_best ?? 0,
      body.completed_challenges ?? 0,
      body.last_session_date ?? null,
    ).run()
  }

  return c.json({ success: true })
})

export default profile
