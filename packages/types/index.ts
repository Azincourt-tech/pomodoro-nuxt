export interface SessionRecord {
  id: string
  startedAt: number
  duration: number
  challengeCompleted: string | null
  xpGained: number
}

export interface StreakData {
  streakCurrent: number
  streakBest: number
  lastSessionDate: string | null
}

export interface PomodoroProfile {
  level: number
  xpCurrent: number
  xpStart: number
  xpEnd: number
  streakCurrent: number
  streakBest: number
  completedChallenges: number
  lastSessionDate: string | null
  updatedAt: string
}

export interface PomodoroSession {
  id: string
  userId: string
  startedAt: string
  durationMinutes: number
  challengeType: string | null
  xpGained: number
  createdAt: string
}

export interface StatsResponse {
  totalSessions: number
  totalMinutes: number
  totalXp: number
  currentStreak: number
  bestStreak: number
  level: number
}
