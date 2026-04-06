import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/drizzle-schema'

// Better Auth schema definitions (for adapter config)
const baUser = {
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

const baSession = {
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

const baAccount = {
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

const baVerification = {
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
  const db = drizzle(env.DB, { schema })

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
        user: baUser,
        session: baSession,
        account: baAccount,
        verification: baVerification,
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

  // Override the handler to add pomodoro profile creation after social login
  const originalHandler = auth.handler
  auth.handler = async (request: Request) => {
    const response = await originalHandler(request)

    // After successful GitHub callback, create pomodoro profile
    if (request.url.includes('/callback/github') && request.method === 'GET') {
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
              // Use Drizzle with typed schema
              const existing = await db.query.pomodoroProfiles.findFirst({
                where: (profiles, { eq }) => eq(profiles.userId, session.user.id),
              })
              if (!existing) {
                await db.insert(schema.pomodoroProfiles).values({
                  userId: session.user.id,
                  displayName: session.user.name || null,
                  avatarUrl: session.user.image || null,
                  updatedAt: new Date().toISOString(),
                })
                console.log('[BetterAuth Backend] Created pomodoro profile for user:', session.user.id)
              }
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
