import { describe, it, expect, vi } from 'vitest'

describe('API Health Check', () => {
  it('should export a default app', async () => {
    const { default: app } = await import('../src/index')
    expect(app).toBeDefined()
    expect(typeof app.fetch).toBe('function')
  })

  it('should respond to health check', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/health')
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('status', 'ok')
    expect(body).toHaveProperty('timestamp')
  })
})

describe('Auth Routes - Sign Up', () => {
  it('should reject sign-up with missing fields', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    })
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  it('should reject sign-up with empty body', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(400)
  })
})

describe('Auth Routes - Sign In', () => {
  it('should reject sign-in with missing credentials', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  it('should reject sign-in with invalid credentials', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'wrong' }),
    })
    const res = await app.fetch(req, createMockEnv())

    // Should return 401 for invalid credentials (may be 401 or other auth error)
    expect([401, 400]).toContain(res.status)
  })
})

describe('Auth Routes - Session', () => {
  it('should return 401 for session without cookie', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/session')
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toHaveProperty('user', null)
    expect(body).toHaveProperty('session', null)
  })
})

describe('Auth Routes - Sign Out', () => {
  it('should return success even without session', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/auth/sign-out', {
      method: 'POST',
    })
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('success', true)
  })
})

describe('Protected Routes', () => {
  it('should return 401 for profile without auth', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/profile')
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(401)
  })

  it('should return 401 for sessions without auth', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/sessions')
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(401)
  })

  it('should return 401 for stats without auth', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/stats')
    const res = await app.fetch(req, createMockEnv())

    expect(res.status).toBe(401)
  })
})

// Mock helpers
function createMockEnv() {
  return {
    DB: createMockD1Database(),
    KV: createMockKV(),
    BETTER_AUTH_SECRET: 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:8787',
  }
}

function createMockD1Database() {
  return {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ success: true }),
      }),
    }),
    exec: async () => ({ results: [] }),
  }
}

function createMockKV() {
  return {
    get: async () => null,
    put: async () => {},
    delete: async () => {},
    list: async () => ({ keys: [] }),
  }
}
