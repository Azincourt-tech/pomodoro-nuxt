// Nuxt plugin to configure auth client with GitHub OAuth
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const githubClientId = config.public.githubClientId as string
  
  // Store in sessionStorage for auth-client to pick up
  if (githubClientId) {
    sessionStorage.setItem('github_client_id', githubClientId)
  }
})
