import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

interface AuthEnv {
  DB: D1Database
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GH_OAUTH_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GH_OAUTH_CLIENT_SECRET?: string
}

// Define Better Auth schema for Drizzle adapter - use text for dates (D1 stores dates as TEXT)
const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
})

const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: text('access_token_expires_at'),
  refreshTokenExpiresAt: text('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export function createAuth(env: AuthEnv) {
  const db = drizzle(env.DB, { casing: 'snake_case' })

  // Configure social providers
  const socialProvidersConfig: any = {}

  // Add GitHub OAuth if credentials are configured
  // Support both GITHUB_CLIENT_ID and GH_OAUTH_CLIENT_ID (Cloudflare var naming)
  const clientId = env.GH_OAUTH_CLIENT_ID || env.GITHUB_CLIENT_ID
  const clientSecret = env.GITHUB_CLIENT_SECRET || env.GH_OAUTH_CLIENT_SECRET
  console.log('[BetterAuth Backend] clientId:', clientId ? `SET (${clientId.substring(0, 8)}...)` : 'NOT SET')
  console.log('[BetterAuth Backend] clientSecret:', clientSecret ? 'SET' : 'NOT SET')
  if (clientId && clientSecret) {
    console.log('[BetterAuth Backend] Configuring GitHub OAuth provider')
    // Try passing credentials directly without github() helper
    socialProvidersConfig.github = {
      clientId: clientId,
      clientSecret: clientSecret,
    }
    console.log('[BetterAuth Backend] socialProvidersConfig keys:', Object.keys(socialProvidersConfig))
    console.log('[BetterAuth Backend] socialProvidersConfig.github:', socialProvidersConfig.github)
  }
  console.log('[BetterAuth Backend] Final socialProviders:', Object.keys(socialProvidersConfig).length > 0 ? 'SET' : 'EMPTY')

  const socialProvidersFinal = Object.keys(socialProvidersConfig).length > 0 ? socialProvidersConfig : undefined
  console.log('[BetterAuth Backend] Passing to betterAuth socialProviders:', socialProvidersFinal ? Object.keys(socialProvidersFinal) : 'undefined')
  
  return betterAuth({
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
      // Allow Vercel preview deployments
      /\.vercel\.app$/,
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
      database: {
        generateId: () => {
          return crypto.randomUUID()
        },
      },
    },
  })
}

export function getAuth(env: AuthEnv) {
  return createAuth(env)
}
// trigger deploy
