/**
 * Auth middleware for Nuxt
 * Protects routes that require authentication.
 * Redirects to /login with ?redirect=<original-route> when not authenticated.
 */
export default defineNuxtRouteMiddleware((to) => {
  const authUser = useAuthUser()

  if (!authUser.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
