import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'

interface AuthEnv {
  DB: D1Database
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
}

export function createAuth(env: AuthEnv) {
  const db = drizzle(env.DB, { casing: 'snake_case' })

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    secret: env.BETTER_AUTH_SECRET || 'pomodoro-dev-secret-change-in-production',
    baseURL: env.BETTER_AUTH_URL || 'http://localhost:8787',
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: false,
      },
    },
    account: {
      accountLinking: {
        enabled: false,
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
