import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { github } from 'better-auth/social-providers'
import { drizzle } from 'drizzle-orm/d1'

interface AuthEnv {
  DB: D1Database
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
}

export function createAuth(env: AuthEnv) {
  const db = drizzle(env.DB, { casing: 'snake_case' })

  const socialProviders = []

  // Add GitHub OAuth if credentials are configured
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    socialProviders.push(
      github({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        mapProfileToUser: (profile) => ({
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }),
      })
    )
  }

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
    socialProviders: socialProviders.length > 0 ? socialProviders : undefined,
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
