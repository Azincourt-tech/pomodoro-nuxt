import { Hono } from 'hono'
import { getAuth } from '../services/auth'
import { drizzle } from 'drizzle-orm/d1'
import { pomodoroProfiles } from '../db/drizzle-schema'

interface Env {
  DB: D1Database
  KV: KVNamespace
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GH_OAUTH_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GH_OAUTH_CLIENT_SECRET?: string
}

export const authRoutes = new Hono<{ Bindings: Env }>()

// Check if GitHub OAuth is enabled
authRoutes.get('/github-enabled', async (c) => {
  const clientId = c.env.GH_OAUTH_CLIENT_ID || c.env.GITHUB_CLIENT_ID
  const clientSecret = c.env.GITHUB_CLIENT_SECRET || c.env.GH_OAUTH_CLIENT_SECRET
  const enabled = !!(clientId && clientSecret)
  return c.json({ enabled })
})

// Custom endpoint to ensure pomodoro profile exists after social login
authRoutes.post('/ensure-profile', async (c) => {
  try {
    const auth = getAuth(c.env)
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    
    if (!session?.user?.id) {
      return c.json({ error: 'Not authenticated' }, 401)
    }
    
    const db = drizzle(c.env.DB, { schema: { pomodoroProfiles } })
    
    // Check if profile exists
    const existing = await db.query.pomodoroProfiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.userId, session.user.id),
    })
    
    if (!existing) {
      // Create pomodoro profile
      await db.insert(pomodoroProfiles).values({
        userId: session.user.id,
        displayName: session.user.name || null,
        avatarUrl: session.user.image || null,
        updatedAt: new Date().toISOString(),
      })
      return c.json({ created: true })
    }
    
    return c.json({ exists: true })
  } catch (err) {
    console.error('Failed to ensure profile:', err)
    return c.json({ error: 'Internal error' }, 500)
  }
})
