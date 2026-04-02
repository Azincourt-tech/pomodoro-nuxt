import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { getAuth } from '../services/auth'
import type { Env } from '../types/env'

interface PomodoroUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
}

const profile = new Hono<{ Bindings: Env }>()

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

// GET /api/pomodoro/profile - Get user profile
profile.get('/', async (c) => {
  const cookieHeader = c.req.header('Cookie')
  const user = await getUserFromSession(c, cookieHeader ?? '')

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const profileData = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(user.id).first()

  if (!profileData) {
    return c.json({
      user_id: user.id,
      level: 1,
      xp_current: 0,
      xp_start: 0,
      xp_end: 64,
      streak_current: 0,
      streak_best: 0,
      completed_challenges: 0,
      last_session_date: null,
      display_name: user.name,
      avatar_url: null,
    })
  }

  return c.json(profileData)
})

// POST /api/pomodoro/profile - Update user profile
profile.post('/', async (c) => {
  const cookieHeader = c.req.header('Cookie')
  const user = await getUserFromSession(c, cookieHeader ?? '')

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
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
    display_name?: string
    avatar_url?: string | null
  }>()

  const existing = await c.env.DB.prepare(
    'SELECT user_id FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(user.id).first()

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
        display_name = COALESCE(?, display_name),
        avatar_url = COALESCE(?, avatar_url),
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
      body.display_name ?? null,
      body.avatar_url ?? null,
      user.id,
    ).run()
  } else {
    await c.env.DB.prepare(`
      INSERT INTO pomodoro_profiles
        (user_id, level, xp_current, xp_start, xp_end, streak_current, streak_best, completed_challenges, last_session_date, display_name, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      body.level ?? 1,
      body.xp_current ?? 0,
      body.xp_start ?? 0,
      body.xp_end ?? 64,
      body.streak_current ?? 0,
      body.streak_best ?? 0,
      body.completed_challenges ?? 0,
      body.last_session_date ?? null,
      body.display_name ?? user.name,
      body.avatar_url ?? null,
    ).run()
  }

  return c.json({ success: true })
})

export default profile
