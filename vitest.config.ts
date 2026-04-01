import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.test.ts', '**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['stores/**', 'components/**', 'utils/**'],
      exclude: ['node_modules', '.nuxt', '.output'],
    },
  },
})
