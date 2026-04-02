import { describe, it, expect } from 'vitest'

describe('API Health Check', () => {
  it('should export a default app', async () => {
    const { default: app } = await import('../src/index')
    expect(app).toBeDefined()
    expect(typeof app.fetch).toBe('function')
  })
})

describe('Profile Routes', () => {
  it('should return 401 for unauthenticated profile request', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/profile')
    const res = await app.fetch(req, {
      DB: createMockD1Database(),
      KV: createMockKV(),
      BETTER_AUTH_SECRET: 'test',
      BETTER_AUTH_URL: 'http://localhost',
    })

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})

describe('Sessions Routes', () => {
  it('should return 401 for unauthenticated sessions request', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/sessions')
    const res = await app.fetch(req, {
      DB: createMockD1Database(),
      KV: createMockKV(),
      BETTER_AUTH_SECRET: 'test',
      BETTER_AUTH_URL: 'http://localhost',
    })

    expect(res.status).toBe(401)
  })
})

describe('Stats Routes', () => {
  it('should return 401 for unauthenticated stats request', async () => {
    const { default: app } = await import('../src/index')

    const req = new Request('http://localhost/api/pomodoro/stats')
    const res = await app.fetch(req, {
      DB: createMockD1Database(),
      KV: createMockKV(),
      BETTER_AUTH_SECRET: 'test',
      BETTER_AUTH_URL: 'http://localhost',
    })

    expect(res.status).toBe(401)
  })
})

// Mock helpers
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
