import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'

// Custom isoDate type for D1/SQLite compatibility
const isoDate = {
  name: 'isoDate',
  field: 'TEXT',
  mapFromDatabaseValue: (val: any) => (val !== null && val !== undefined ? String(val) : val),
  mapToDatabaseValue: (val: any) => (val !== null && val !== undefined ? String(val) : val),
}

// Better Auth schema definitions for D1
const user = {
  tableName: 'user',
  fields: {
    id: { type: 'string', columnName: 'id' },
    name: { type: 'string', columnName: 'name' },
    email: { type: 'string', columnName: 'email' },
    emailVerified: { type: 'boolean', columnName: 'email_verified' },
    image: { type: 'string', columnName: 'image' },
    createdAt: { type: 'date', columnName: 'created_at' },
    updatedAt: { type: 'date', columnName: 'updated_at' },
  },
}

const session = {
  tableName: 'session',
  fields: {
    id: { type: 'string', columnName: 'id' },
    userId: { type: 'string', columnName: 'user_id' },
    token: { type: 'string', columnName: 'token' },
    expiresAt: { type: 'date', columnName: 'expires_at' },
    ipAddress: { type: 'string', columnName: 'ip_address' },
    userAgent: { type: 'string', columnName: 'user_agent' },
    createdAt: { type: 'date', columnName: 'created_at' },
    updatedAt: { type: 'date', columnName: 'updated_at' },
  },
}

const account = {
  tableName: 'account',
  fields: {
    id: { type: 'string', columnName: 'id' },
    userId: { type: 'string', columnName: 'user_id' },
    accountId: { type: 'string', columnName: 'account_id' },
    providerId: { type: 'string', columnName: 'provider_id' },
    accessToken: { type: 'string', columnName: 'access_token' },
    refreshToken: { type: 'string', columnName: 'refresh_token' },
    accessTokenExpiresAt: { type: 'date', columnName: 'access_token_expires_at' },
    refreshTokenExpiresAt: { type: 'date', columnName: 'refresh_token_expires_at' },
    scope: { type: 'string', columnName: 'scope' },
    idToken: { type: 'string', columnName: 'id_token' },
    password: { type: 'string', columnName: 'password' },
    createdAt: { type: 'date', columnName: 'created_at' },
    updatedAt: { type: 'date', columnName: 'updated_at' },
  },
}

const verification = {
  tableName: 'verification',
  fields: {
    id: { type: 'string', columnName: 'id' },
    identifier: { type: 'string', columnName: 'identifier' },
    value: { type: 'string', columnName: 'value' },
    expiresAt: { type: 'date', columnName: 'expires_at' },
    createdAt: { type: 'date', columnName: 'created_at' },
    updatedAt: { type: 'date', columnName: 'updated_at' },
  },
}

export function getAuth(env: {
  DB: D1Database
  GH_OAUTH_CLIENT_ID?: string
  GH_OAUTH_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  BETTER_AUTH_SECRET?: string
  BETTER_AUTH_URL?: string
}) {
  const db = drizzle(env.DB)

  // Support both naming conventions
  const clientId = env.GH_OAUTH_CLIENT_ID || env.GITHUB_CLIENT_ID
  const clientSecret = env.GH_OAUTH_CLIENT_SECRET || env.GITHUB_CLIENT_SECRET

  // Set up social providers
  const socialProvidersConfig: Record<string, any> = {}

  console.log('[BetterAuth Backend] clientId:', clientId ? `SET (${clientId.substring(0, 8)}...)` : 'NOT SET')
  console.log('[BetterAuth Backend] clientSecret:', clientSecret ? 'SET' : 'NOT SET')
  if (clientId && clientSecret) {
    console.log('[BetterAuth Backend] Configuring GitHub OAuth provider')
    socialProvidersConfig.github = {
      clientId,
      clientSecret,
    }
    console.log('[BetterAuth Backend] socialProvidersConfig keys:', Object.keys(socialProvidersConfig))
  }
  console.log('[BetterAuth Backend] Final socialProviders:', Object.keys(socialProvidersConfig).length > 0 ? 'SET' : 'EMPTY')

  const socialProvidersFinal = Object.keys(socialProvidersConfig).length > 0 ? socialProvidersConfig : undefined
  console.log('[BetterAuth Backend] Passing to betterAuth socialProviders:', socialProvidersFinal ? Object.keys(socialProvidersFinal) : 'undefined')

  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user,
        session,
        account,
        verification,
      },
    }),
    secret: env.BETTER_AUTH_SECRET || 'pomodoro-dev-secret-change-in-production',
    baseURL: env.BETTER_AUTH_URL || 'http://localhost:8787',
    trustedOrigins: [
      env.BETTER_AUTH_URL || 'http://localhost:8787',
      'https://pomodoro-nuxt-ten.vercel.app',
      'http://localhost:3000',
    ].filter(Boolean),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    socialProviders: socialProvidersFinal,
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
      cookies: {
        sessionToken: {
          name: 'better-auth.session_token',
          attributes: {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
          },
        },
        state: {
          name: 'better-auth.state',
          attributes: {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
          },
        },
        nonce: {
          name: 'better-auth.nonce',
          attributes: {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
          },
        },
      },
    },
  })

  // Override the handler to add pomodoro profile creation
  const originalHandler = auth.handler
  auth.handler = async (request: Request) => {
    const response = await originalHandler(request)

    // After successful sign-in via social provider, create pomodoro profile
    if (request.url.includes('/callback/github') && request.method === 'GET') {
      // Extract session from response cookies to get user info
      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        const tokenMatch = setCookie.match(/better-auth\.session_token=([^;]+)/)
        if (tokenMatch) {
          const sessionToken = tokenMatch[1]
          try {
            const session = await auth.api.getSession({
              headers: new Headers({ cookie: `better-auth.session_token=${sessionToken}` }),
            })
            if (session?.user?.id) {
              // Check if pomodoro profile exists and create if not
              await env.DB.prepare(
                'INSERT OR IGNORE INTO pomodoro_profiles (user_id, display_name, avatar_url, level, xp_current, xp_start, xp_end, streak_current, streak_best, completed_challenges) VALUES (?, ?, ?, 1, 0, 0, 64, 0, 0, 0)'
              ).bind(session.user.id, session.user.name || null, session.user.image || null).run()
              console.log('[BetterAuth Backend] Ensured pomodoro profile for user:', session.user.id)
            }
          } catch (e) {
            console.error('[BetterAuth Backend] Failed to create pomodoro profile:', e)
          }
        }
      }
    }

    return response
  }

  return auth
}

export type Auth = ReturnType<typeof getAuth>
