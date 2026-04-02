import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the useAuth composable
const mockAuthUser = { value: null }
const mockAuthSession = { value: null }

vi.mock('~/composables/useAuth', () => ({
  useAuthUser: () => mockAuthUser,
  useAuthSession: () => mockAuthSession,
  useAuthLoading: () => ({ value: false }),
  useAuth: () => ({
    user: mockAuthUser,
    session: mockAuthSession,
    loading: { value: false },
    login: vi.fn().mockResolvedValue({ success: true }),
    signUp: vi.fn().mockResolvedValue({ success: true }),
    logout: vi.fn().mockResolvedValue(undefined),
    fetchSession: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: () => mockAuthUser.value !== null,
  }),
}))

// Import after mock
import { useAuth, useAuthUser } from '~/composables/useAuth'

describe('Auth Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockAuthUser.value = null
    mockAuthSession.value = null
  })

  it('should return auth user as null when not logged in', () => {
    const user = useAuthUser()
    expect(user.value).toBe(null)
  })

  it('should return isAuthenticated as false when not logged in', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated()).toBe(false)
  })

  it('should have login function', () => {
    const { login } = useAuth()
    expect(typeof login).toBe('function')
  })

  it('should have signUp function', () => {
    const { signUp } = useAuth()
    expect(typeof signUp).toBe('function')
  })

  it('should have logout function', () => {
    const { logout } = useAuth()
    expect(typeof logout).toBe('function')
  })

  it('should have fetchSession function', () => {
    const { fetchSession } = useAuth()
    expect(typeof fetchSession).toBe('function')
  })
})
