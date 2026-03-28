<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Navbar -->
    <nav class="navbar bg-base-100 shadow-sm px-4 lg:px-8 sticky top-0 z-50 backdrop-blur-sm bg-base-100/95">
      <div class="flex-1">
        <NuxtLink to="/" class="btn btn-ghost text-xl font-bold font-rajdhani tracking-wide gap-2">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pomodoro
        </NuxtLink>
      </div>
      <div class="flex-none">
        <div class="flex items-center gap-3">
          <span class="badge badge-primary badge-sm font-medium hidden sm:flex">Level {{ challenges.level }}</span>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div tabindex="0" class="dropdown-content z-[10] mt-3 p-2 shadow-lg bg-base-100 rounded-box w-64">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Experience Bar -->
    <div class="max-w-6xl mx-auto w-full px-4 pt-6">
      <ExperienceBar />
    </div>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto w-full px-4 pb-8 flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-base-100 border-t border-base-300 mt-auto">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-sm text-base-content/60">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pomodoro Move.it - Produtividade com saude</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-base-content/50">
            <span>Feito com foco e cafe</span>
            <a href="https://github.com/Azincourt-tech" target="_blank" rel="noopener" class="link link-hover text-primary">
              Azincourt-tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ExperienceBar from '~/components/atoms/ExperienceBar.vue'
import ThemeSelector from '~/components/atoms/ThemeSelector.vue'
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>
