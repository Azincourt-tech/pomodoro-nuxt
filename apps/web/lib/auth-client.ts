import { createAuthClient, type BetterAuthClient } from 'better-auth/client'

const apiBase = 'https://pomodoro-api.azlab.dev.br'

let _client: BetterAuthClient | null = null
let _clientId: string | null = null
let _initPromise: Promise<void> | null = null

async function fetchGithubClientId(): Promise<string> {
  if (_clientId !== null) return _clientId
  
  try {
    const res = await fetch(`${apiBase}/api/config/oauth`)
    const data = await res.json()
    _clientId = data.githubClientId || ''
  } catch {
    _clientId = ''
  }
  
  return _clientId
}

async function initClient(): Promise<BetterAuthClient> {
  if (_client) return _client
  if (_initPromise) {
    await _initPromise
    return _client!
  }
  
  _initPromise = (async () => {
    const githubClientId = await fetchGithubClientId()
    
    _client = createAuthClient({
      baseURL: apiBase,
      ...(githubClientId ? {
        socialProviders: {
          github: {
            clientId: githubClientId,
          },
        },
      } : {}),
    })
  })()
  
  await _initPromise
  return _client!
}

// Initialize immediately in browser
if (typeof window !== 'undefined') {
  initClient().catch(console.error)
}

export { initClient, fetchGithubClientId }

// Export a proxy that waits for init
export const authClient = new Proxy({} as BetterAuthClient, {
  get(_target, prop) {
    if (!_client) {
      throw new Error('Auth client not initialized. Call initClient() first.')
    }
    return (_client as any)[prop]
  },
})
