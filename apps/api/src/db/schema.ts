/**
 * D1 Database Schema for Pomodoro Move.it
 *
 * Tables: users, sessions, accounts, verification, pomodoro_profiles, pomodoro_sessions
 * Better Auth manages users/sessions/accounts/verification
 * Pomodoro-specific data in pomodoro_profiles and pomodoro_sessions
 */

// Better Auth tables
export const createUsersTable = `
CREATE TABLE IF NOT EXISTS "user" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0,
  image       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const createSessionsTable = `
CREATE TABLE IF NOT EXISTS session (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const createAccountsTable = `
CREATE TABLE IF NOT EXISTS account (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  account_id  TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  access_token_expires_at TEXT,
  refresh_token_expires_at TEXT,
  scope       TEXT,
  id_token    TEXT,
  password    TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const createVerificationTable = `
CREATE TABLE IF NOT EXISTS verification (
  id          TEXT PRIMARY KEY,
  identifier  TEXT NOT NULL,
  value       TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Pomodoro-specific tables
export const createPomodoroProfilesTable = `
CREATE TABLE IF NOT EXISTS pomodoro_profiles (
  user_id             TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  level               INTEGER NOT NULL DEFAULT 1,
  xp_current          INTEGER NOT NULL DEFAULT 0,
  xp_start            INTEGER NOT NULL DEFAULT 0,
  xp_end              INTEGER NOT NULL DEFAULT 64,
  streak_current      INTEGER NOT NULL DEFAULT 0,
  streak_best         INTEGER NOT NULL DEFAULT 0,
  completed_challenges INTEGER NOT NULL DEFAULT 0,
  last_session_date   TEXT,
  display_name        TEXT,
  avatar_url          TEXT,
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const createPomodoroSessionsTable = `
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  started_at        TEXT NOT NULL,
  duration_minutes  INTEGER NOT NULL,
  challenge_type    TEXT,
  challenge_desc    TEXT,
  xp_gained         INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Indexes
export const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON account(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_date ON pomodoro_sessions(started_at);
`;

export const runMigrations = `
${createUsersTable}
${createSessionsTable}
${createAccountsTable}
${createVerificationTable}
${createPomodoroProfilesTable}
${createPomodoroSessionsTable}
${createIndexes}
`;
