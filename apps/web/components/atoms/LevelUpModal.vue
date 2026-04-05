<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <dialog
        v-if="challenges.isLevelUpModalOpen"
        class="modal modal-open"
      >
        <div class="modal-box bg-gradient-to-br from-base-100 via-base-200 to-base-100 border-2 border-primary/30 shadow-2xl max-w-md relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
          </div>

          <!-- Close button -->
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
            @click="challenges.setIsLevelUpModalOpen(false)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="py-8 relative z-10">
            <!-- Celebration Icon -->
            <div class="mb-6 relative">
              <div class="text-center">
                <!-- Animated stars -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="animate-spin-slow">
                    <svg class="w-32 h-32 text-warning/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Level Number -->
                <div class="relative">
                  <div class="text-9xl font-black font-rajdhani bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-2xl animate-bounce-slow">
                    {{ challenges.level }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Congratulations Text -->
            <div class="text-center space-y-3">
              <h3 class="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🎉 {{ $t('levelUp.congratulations') }} 🎉
              </h3>
              
              <p class="text-base-content/70 text-lg">
                {{ $t('levelUp.newLevel') }}
              </p>

              <!-- XP Info -->
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mt-4">
                <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-bold text-primary">Level {{ challenges.level }}</span>
                <span class="text-base-content/50">•</span>
                <span class="text-sm text-base-content/60">{{ challenges.xp.current }} XP</span>
              </div>
            </div>
          </div>

          <div class="modal-action justify-center relative z-10">
            <button
              class="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-200 group"
              @click="challenges.setIsLevelUpModalOpen(false)"
            >
              <span>{{ $t('levelUp.continue') }}</span>
              <svg
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
        
        <form
          method="dialog"
          class="modal-backdrop"
        >
          <button @click="challenges.setIsLevelUpModalOpen(false)">
            close
          </button>
        </form>
      </dialog>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
