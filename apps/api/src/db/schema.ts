export const schema = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pomodoro_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  level INTEGER NOT NULL DEFAULT 1,
  xp_current INTEGER NOT NULL DEFAULT 0,
  xp_start INTEGER NOT NULL DEFAULT 0,
  xp_end INTEGER NOT NULL DEFAULT 64,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_best INTEGER NOT NULL DEFAULT 0,
  completed_challenges INTEGER NOT NULL DEFAULT 0,
  last_session_date TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  started_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  challenge_type TEXT,
  xp_gained INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_date ON pomodoro_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`;
