export interface Env {
  DB: D1Database
  KV: KVNamespace
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GITHUB_CLIENT_ID?: string
  GH_OAUTH_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GH_OAUTH_CLIENT_SECRET?: string
}
