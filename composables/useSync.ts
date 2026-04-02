import { ref } from 'vue'
import { useProfileStore, type StreakData } from '~/stores/profile'
import { useHistoryStore, type SessionRecord } from '~/stores/history'
import { useChallengesStore, type XP } from '~/stores/challenges'

interface SyncConfig {
  apiUrl: string
  token: string | null
}

interface ApiProfile {
  user_id: string
  level: number
  xp_current: number
  xp_start: number
  xp_end: number
  streak_current: number
  streak_best: number
  completed_challenges: number
  last_session_date: string | null
}

interface ApiSession {
  id: string
  started_at: string
  duration_minutes: number
  challenge_type: string | null
  xp_gained: number
}

const token = ref<string | null>(null)
const isSyncing = ref(false)
const syncError = ref<string | null>(null)
const lastSyncedAt = ref<string | null>(null)

const STORAGE_KEY = 'pomodoro-sync-token'

export function useSync() {
  const profile = useProfileStore()
  const history = useHistoryStore()
  const challenges = useChallengesStore()

  function initFromStorage() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        token.value = saved
      }
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (import.meta.client) {
      if (newToken) {
        localStorage.setItem(STORAGE_KEY, newToken)
      }
      else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    syncError.value = null
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        syncError.value = data.error ?? 'Login failed'
        return false
      }

      const data = await res.json() as { token: string }
      setToken(data.token)
      await syncFromRemote()
      return true
    }
    catch (err) {
      syncError.value = err instanceof Error ? err.message : 'Login failed'
      return false
    }
  }

  async function register(email: string, password: string, name: string): Promise<boolean> {
    syncError.value = null
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        syncError.value = data.error ?? 'Registration failed'
        return false
      }

      const data = await res.json() as { token: string }
      setToken(data.token)
      await syncFromRemote()
      return true
    }
    catch (err) {
      syncError.value = err instanceof Error ? err.message : 'Registration failed'
      return false
    }
  }

  async function logout() {
    if (token.value) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` },
        })
      }
      catch {
        // Ignore logout errors
      }
    }
    setToken(null)
  }

  async function syncFromRemote() {
    if (!token.value) return

    isSyncing.value = true
    syncError.value = null

    try {
      // Fetch remote profile
      const profileRes = await fetch('/api/pomodoro/profile', {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (profileRes.ok) {
        const remoteProfile = await profileRes.json() as ApiProfile
        mergeProfile(remoteProfile)
      }

      // Fetch remote sessions
      const sessionsRes = await fetch('/api/pomodoro/sessions?limit=100', {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (sessionsRes.ok) {
        const data = await sessionsRes.json() as { sessions: ApiSession[] }
        mergeSessions(data.sessions)
      }

      // Push local data to remote
      await pushLocalData()

      lastSyncedAt.value = new Date().toISOString()
    }
    catch (err) {
      syncError.value = err instanceof Error ? err.message : 'Sync failed'
    }
    finally {
      isSyncing.value = false
    }
  }

  function mergeProfile(remote: ApiProfile) {
    // Use higher values (merge, don't overwrite)
    const localLevel = challenges.level
    const localXp = challenges.xp.current
    const localStreak = profile.streakCurrent
    const localBestStreak = profile.streakBest

    const newLevel = Math.max(localLevel, remote.level)
    const newXp = Math.max(localXp, remote.xp_current)
    const newStreak = Math.max(localStreak, remote.streak_current)
    const newBestStreak = Math.max(localBestStreak, remote.streak_best)

    // Update challenges store
    if (newLevel !== localLevel || newXp !== localXp) {
      challenges.level = newLevel
      challenges.xp = { current: newXp, start: remote.xp_start, end: remote.xp_end }
      challenges.completedChallenges = Math.max(challenges.completedChallenges, remote.completed_challenges)
      challenges.saveToStorage()
    }

    // Update streak
    if (newStreak !== localStreak || newBestStreak !== localBestStreak) {
      profile.streak.streakCurrent = newStreak
      profile.streak.streakBest = newBestStreak
      profile.streak.lastSessionDate = remote.last_session_date
      profile.saveToStorage()
    }
  }

  function mergeSessions(remoteSessions: ApiSession[]) {
    const localIds = new Set(history.sessions.map(s => s.id))
    const remoteIds = new Set(remoteSessions.map(s => s.id))

    // Add remote sessions not in local
    for (const remote of remoteSessions) {
      if (!localIds.has(remote.id)) {
        const session: SessionRecord = {
          id: remote.id,
          startedAt: new Date(remote.started_at).getTime(),
          duration: remote.duration_minutes,
          challengeCompleted: remote.challenge_type,
          xpGained: remote.xp_gained,
        }
        history.sessions.push(session)
      }
    }

    // Push local sessions not in remote
    const localOnlySessions = history.sessions.filter(s => !remoteIds.has(s.id))

    history.sessions.sort((a, b) => b.startedAt - a.startedAt)
    history.saveToStorage()
  }

  async function pushLocalData() {
    if (!token.value) return

    // Push profile
    await fetch('/api/pomodoro/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        level: challenges.level,
        xp_current: challenges.xp.current,
        xp_start: challenges.xp.start,
        xp_end: challenges.xp.end,
        streak_current: profile.streakCurrent,
        streak_best: profile.streakBest,
        completed_challenges: challenges.completedChallenges,
        last_session_date: profile.lastSessionDate,
      }),
    })

    // Push local-only sessions
    const remoteIdsRes = await fetch('/api/pomodoro/sessions?limit=1000', {
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (remoteIdsRes.ok) {
      const data = await remoteIdsRes.json() as { sessions: ApiSession[] }
      const remoteIds = new Set(data.sessions.map(s => s.id))

      for (const session of history.sessions) {
        if (!remoteIds.has(session.id)) {
          await fetch('/api/pomodoro/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.value}`,
            },
            body: JSON.stringify({
              id: session.id,
              started_at: new Date(session.startedAt).toISOString(),
              duration_minutes: session.duration,
              challenge_type: session.challengeCompleted,
              xp_gained: session.xpGained,
            }),
          })
        }
      }
    }
  }

  async function syncAfterSession() {
    if (token.value) {
      await pushLocalData()
      lastSyncedAt.value = new Date().toISOString()
    }
  }

  return {
    token,
    isSyncing,
    syncError,
    lastSyncedAt,
    isLoggedIn: () => token.value !== null,
    initFromStorage,
    login,
    register,
    logout,
    syncFromRemote,
    syncAfterSession,
  }
}
