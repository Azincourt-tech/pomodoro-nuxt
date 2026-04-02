import { Hono } from 'hono'
import type { Env } from '../types/env'

const stats = new Hono<{ Bindings: Env }>()

// GET /api/pomodoro/stats - Get aggregated stats
stats.get('/', async (c) => {
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

  // Get session stats
  const sessionStats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_sessions,
      COALESCE(SUM(duration_minutes), 0) as total_minutes,
      COALESCE(SUM(xp_gained), 0) as total_xp
    FROM pomodoro_sessions
    WHERE user_id = ?
  `).bind(session.user_id).first<{
    total_sessions: number
    total_minutes: number
    total_xp: number
  }>()

  // Get profile data
  const profile = await c.env.DB.prepare(
    'SELECT * FROM pomodoro_profiles WHERE user_id = ?',
  ).bind(session.user_id).first<{
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
