import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { github } from 'better-auth/social-providers'
import { drizzle } from 'drizzle-orm/d1'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { customType } from 'drizzle-orm/sqlite-core'

// Custom date type that converts Date to ISO string for D1
const isoDate = customType<{ data: Date | string; driverData: string }>({
  dataType() {
    return 'text'
  },
  toDriver(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString()
    }
    return String(value)
  },
  fromDriver(value: string): Date | string {
    return value
  },
})

interface AuthEnv {
  DB: D1Database
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GH_OAUTH_CLIENT_SECRET?: string
}

// Define Better Auth schema for Drizzle adapter
const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: isoDate('created_at').notNull(),
  updatedAt: isoDate('updated_at').notNull(),
})

const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: isoDate('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: isoDate('created_at').notNull(),
  updatedAt: isoDate('updated_at').notNull(),
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
  accessTokenExpiresAt: isoDate('access_token_expires_at'),
  refreshTokenExpiresAt: isoDate('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: isoDate('created_at').notNull(),
  updatedAt: isoDate('updated_at').notNull(),
})

const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: isoDate('expires_at').notNull(),
  createdAt: isoDate('created_at').notNull(),
  updatedAt: isoDate('updated_at').notNull(),
})

export function createAuth(env: AuthEnv) {
  const db = drizzle(env.DB, { casing: 'snake_case' })

  // Configure social providers
  const socialProvidersConfig: any = {}

  // Add GitHub OAuth if credentials are configured
  // Support both GITHUB_CLIENT_SECRET (standard) and GH_OAUTH_CLIENT_SECRET (avoid Cloudflare var conflict)
  const clientSecret = env.GITHUB_CLIENT_SECRET || env.GH_OAUTH_CLIENT_SECRET
  if (env.GITHUB_CLIENT_ID && clientSecret) {
    socialProvidersConfig.github = github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: clientSecret,
      mapProfileToUser: (profile) => ({
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }),
    })
  }

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
    ].filter(Boolean),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    socialProviders: Object.keys(socialProvidersConfig).length > 0 ? socialProvidersConfig : undefined,
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: false,
      },
    },
    account: {
      accountLinking: {
        enabled: true, // Allow linking accounts from same email
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
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
