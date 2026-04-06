// Nuxt plugin to initialize auth client with GitHub OAuth config
export default defineNuxtPlugin(async () => {
  const { getAuthClient } = await import('~/lib/auth-client')
  
  // Initialize the auth client early
  // This fetches the GitHub client ID from the API
  await getAuthClient()
})
