import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { getAuth } from '../services/auth'

interface Env {
  DB: D1Database
  KV: KVNamespace
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
}

interface PomodoroUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  githubUsername?: string | null
  [key: string]: unknown
}

interface PomodoroSession {
  id: string
  token: string
  expiresAt: string | Date
  [key: string]: unknown
}

function getAuthFromContext(c: { env: Env }) {
  return getAuth({
    DB: c.env.DB,
    BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: c.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: c.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: c.env.GITHUB_CLIENT_SECRET,
  })
}

export const authRoutes = new Hono<{ Bindings: Env }>()

authRoutes.post('/sign-in', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()

  if (!body.email || !body.password) {
    return c.json({ error: 'Email e senha são obrigatórios' }, 400)
  }

  try {
    const auth = getAuthFromContext(c)

    const result = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
    })

    if (!result) {
      return c.json({ error: 'Credenciais inválidas' }, 401)
    }

    const data = result as Record<string, unknown>
    const user = (data.user ?? data) as PomodoroUser
    const session = data.session as PomodoroSession | undefined

    if (!session || !session.token) {
      return c.json({ error: 'Credenciais inválidas' }, 401)
    }

    c.header(
      'Set-Cookie',
      `better-auth.session_token=${session.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
    )

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? null,
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    })
  } catch {
    return c.json({ error: 'Credenciais inválidas' }, 401)
  }
})

authRoutes.post('/sign-up', async (c) => {
  const body = await c.req.json<{ email: string; password: string; name: string }>()

  if (!body.email || !body.password || !body.name) {
    return c.json({ error: 'Email, senha e nome são obrigatórios' }, 400)
  }

  try {
    const auth = getAuthFromContext(c)

    const result = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    })

    if (!result) {
      return c.json({ error: 'Erro ao criar conta' }, 400)
    }

    const data = result as Record<string, unknown>
    const user = (data.user ?? data) as PomodoroUser
    const session = data.session as PomodoroSession | undefined

    if (session && session.token) {
      c.header(
        'Set-Cookie',
        `better-auth.session_token=${session.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
      )
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? null,
      },
      session: session
        ? {
            id: session.id,
            expiresAt: session.expiresAt,
          }
        : null,
    }, 201)
  } catch (err: unknown) {
    const error = err as { message?: string }
    if (error.message?.includes('UNIQUE constraint')) {
      return c.json({ error: 'Email já cadastrado' }, 409)
    }
    return c.json({ error: 'Erro ao criar conta' }, 400)
  }
})

authRoutes.post('/sign-out', async (c) => {
  try {
    const auth = getAuthFromContext(c)
    const sessionToken = getCookie(c, 'better-auth.session_token')

    if (sessionToken) {
      try {
        await auth.api.signOut({
          headers: {
            cookie: `better-auth.session_token=${sessionToken}`,
          },
        })
      } catch {
        // Idempotent
      }
    }

    c.header(
      'Set-Cookie',
      'better-auth.session_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    )

    return c.json({ success: true })
  } catch {
    return c.json({ success: true })
  }
})

authRoutes.get('/session', async (c) => {
  try {
    const auth = getAuthFromContext(c)
    const sessionToken = getCookie(c, 'better-auth.session_token')

    if (!sessionToken) {
      return c.json({ user: null, session: null }, 401)
    }

    const result = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken}`,
      },
    })

    if (!result) {
      return c.json({ user: null, session: null }, 401)
    }

    const data = result as Record<string, unknown>
    const user = (data.user ?? null) as PomodoroUser | null
    const session = data.session as PomodoroSession | undefined

    if (!user) {
      return c.json({ user: null, session: null }, 401)
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl ?? null,
      },
      session: session
        ? {
            id: session.id,
            expiresAt: session.expiresAt,
          }
        : null,
    })
  } catch {
    return c.json({ user: null, session: null }, 401)
  }
})

// Check if GitHub OAuth is enabled
authRoutes.get('/github-enabled', async (c) => {
  const enabled = !!(c.env.GITHUB_CLIENT_ID && c.env.GITHUB_CLIENT_SECRET)
  return c.json({ enabled })
})

// Get GitHub OAuth URL
authRoutes.get('/github-login', async (c) => {
  const enabled = !!(c.env.GITHUB_CLIENT_ID && c.env.GITHUB_CLIENT_SECRET)
  if (!enabled) {
    return c.json({ error: 'GitHub OAuth não configurado' }, 400)
  }

  const callbackURL = c.req.query('callbackURL') || `${c.env.BETTER_AUTH_URL}/api/better-auth/callback/github`
  const baseURL = c.env.BETTER_AUTH_URL || `${new URL(c.req.url).origin}`

  return c.json({
    url: `${baseURL}/api/better-auth/sign-in/social?provider=github&callbackURL=${encodeURIComponent(callbackURL)}`,
  })
})
