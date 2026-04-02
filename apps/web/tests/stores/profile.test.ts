import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '~/stores/profile'

describe('Profile Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useProfileStore()

    expect(store.profile.name).toBe('User')
    expect(store.profile.avatar).toBe('')
    expect(store.profile.githubUsername).toBe(null)
    expect(store.isEditing).toBe(false)
  })

  it('should return displayName getter', () => {
    const store = useProfileStore()

    expect(store.displayName).toBe('User')

    store.updateProfile({ name: 'John Doe' })
    expect(store.displayName).toBe('John Doe')
  })

  it('should generate avatar URL for github user', () => {
    const store = useProfileStore()
    store.setGithubUser('octocat')

    expect(store.avatarUrl).toBe('https://github.com/octocat.png')
  })

  it('should return custom avatar URL when set', () => {
    const store = useProfileStore()
    store.updateProfile({ avatar: 'https://example.com/avatar.png' })

    expect(store.avatarUrl).toBe('https://example.com/avatar.png')
  })

  it('should generate default avatar URL', () => {
    const store = useProfileStore()

    expect(store.avatarUrl).toContain('https://ui-avatars.com/api/')
    expect(store.avatarUrl).toContain('name=User')
  })

  it('should update profile partially', () => {
    const store = useProfileStore()

    store.updateProfile({ name: 'Jane Doe' })

    expect(store.profile.name).toBe('Jane Doe')
    expect(store.profile.avatar).toBe('') // unchanged
    expect(store.profile.githubUsername).toBe(null) // unchanged
  })

  it('should set github user and clear avatar', () => {
    const store = useProfileStore()
    store.updateProfile({ avatar: 'old-avatar.png' })

    store.setGithubUser('testuser')

    expect(store.profile.githubUsername).toBe('testuser')
    expect(store.profile.avatar).toBe('')
  })

  it('should clear github user', () => {
    const store = useProfileStore()
    store.setGithubUser('testuser')

    store.clearGithubUser()

    expect(store.profile.githubUsername).toBe(null)
  })

  it('should set editing state', () => {
    const store = useProfileStore()

    store.setEditing(true)
    expect(store.isEditing).toBe(true)

    store.setEditing(false)
    expect(store.isEditing).toBe(false)
  })

  it('should handle avatar URL priority correctly', () => {
    const store = useProfileStore()

    // Case 1: Only name set - should use ui-avatars
    expect(store.avatarUrl).toContain('ui-avatars.com')

    // Case 2: Avatar set, no github - should use avatar
    store.updateProfile({ avatar: 'https://custom.com/pic.jpg' })
    expect(store.avatarUrl).toBe('https://custom.com/pic.jpg')

    // Case 3: GitHub username set - should use GitHub avatar
    store.setGithubUser('devuser')
    expect(store.avatarUrl).toBe('https://github.com/devuser.png')
  })

  it('should handle profile update with all fields', () => {
    const store = useProfileStore()

    store.updateProfile({
      name: 'Full Name',
      avatar: 'https://example.com/me.png',
      githubUsername: 'myuser',
    })

    expect(store.profile.name).toBe('Full Name')
    expect(store.profile.avatar).toBe('https://example.com/me.png')
    expect(store.profile.githubUsername).toBe('myuser')
  })
})
