import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

// Pomodoro tables only (Better Auth tables are managed by Better Auth adapter)
export const pomodoroProfiles = sqliteTable('pomodoro_profiles', {
  userId: text('user_id').primaryKey(),
  level: integer('level').notNull().default(1),
  xpCurrent: integer('xp_current').notNull().default(0),
  xpStart: integer('xp_start').notNull().default(0),
  xpEnd: integer('xp_end').notNull().default(64),
  streakCurrent: integer('streak_current').notNull().default(0),
  streakBest: integer('streak_best').notNull().default(0),
  completedChallenges: integer('completed_challenges').notNull().default(0),
  lastSessionDate: text('last_session_date'),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  updatedAt: text('updated_at').notNull(),
})

export const pomodoroSessions = sqliteTable('pomodoro_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  startedAt: text('started_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  challengeType: text('challenge_type'),
  challengeDesc: text('challenge_desc'),
  xpGained: integer('xp_gained').notNull().default(0),
  createdAt: text('created_at').notNull(),
})
