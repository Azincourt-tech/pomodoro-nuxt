import { Hono } from 'hono'
import type { Env } from '../types/env'
import { cors } from 'hono/cors'
import profile from './routes/profile'
import sessions from './routes/sessions'
import stats from './routes/stats'
import { authRoutes } from './routes/auth'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://pomodoro-move.it'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
}))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Auth routes (Better Auth)
app.route('/api/auth', authRoutes)

// Pomodoro routes
app.route('/api/pomodoro/profile', profile)
app.route('/api/pomodoro/sessions', sessions)
app.route('/api/pomodoro/stats', stats)

export default app
