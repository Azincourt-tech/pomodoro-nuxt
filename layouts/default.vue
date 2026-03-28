<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar -->
    <nav class="navbar bg-base-100 shadow-sm px-4 lg:px-8 sticky top-0 z-50">
      <div class="flex-1">
        <NuxtLink to="/" class="btn btn-ghost text-xl font-bold font-rajdhani tracking-wide gap-2">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pomodoro
        </NuxtLink>
      </div>
      <div class="flex-none gap-2">
        <ThemeSelector />
      </div>
    </nav>

    <!-- Experience Bar -->
    <div class="max-w-5xl mx-auto w-full px-4 pt-6">
      <ExperienceBar />
    </div>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto w-full px-4 pb-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import ThemeSelector from '~/components/atoms/ThemeSelector.vue'
</script>
