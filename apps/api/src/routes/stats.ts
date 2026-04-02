import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import type { Env } from '../types/env'

interface PomodoroUser {
  id: string
  email: string
  name: string
}

const stats = new Hono<{ Bindings: Env }>()

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

// GET /api/pomodoro/stats - Get aggregated stats
stats.get('/', async (c) => {
  const cookieHeader = c.req.header('Cookie')
  const user = await getUserFromSession(c, cookieHeader ?? '')
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Get session stats
  const sessionStats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_sessions,
      COALESCE(SUM(duration_minutes), 0) as total_minutes,
      COALESCE(SUM(xp_gained), 0) as total_xp
    FROM pomodoro_sessions
    WHERE user_id = ?
  `).bind(user.id).first<{
    total_sessions: number
    total_minutes: number
    total_xp: number
  }>()

  // Get profile data
  const profile = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(user.id).first<{
    level: number
    streak_current: number
    streak_best: number
  }>()

  return c.json({
    totalSessions: sessionStats?.total_sessions ?? 0,
    totalMinutes: sessionStats?.total_minutes ?? 0,
    totalXp: sessionStats?.total_xp ?? 0,
    currentStreak: profile?.streak_current ?? 0,
    bestStreak: profile?.streak_best ?? 0,
    level: profile?.level ?? 1,
  })
})

export default stats
