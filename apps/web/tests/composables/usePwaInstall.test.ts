import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePwaInstall } from '~/composables/usePwaInstall'

describe('usePwaInstall Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return canInstall as false initially', () => {
    const { canInstall } = usePwaInstall()
    expect(canInstall.value).toBe(false)
  })

  it('should return isInstalled as false initially', () => {
    const { isInstalled } = usePwaInstall()
    expect(isInstalled.value).toBe(false)
  })

  it('should have install function', () => {
    const { install } = usePwaInstall()
    expect(typeof install).toBe('function')
  })

  it('should have dismiss function', () => {
    const { dismiss } = usePwaInstall()
    expect(typeof dismiss).toBe('function')
  })

  it('should return false when installing without deferred prompt', async () => {
    const { install } = usePwaInstall()
    const result = await install()
    expect(result).toBe(false)
  })
})
