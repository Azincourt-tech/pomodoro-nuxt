<template>
  <div class="hero min-h-[280px] bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 rounded-2xl shadow-lg border border-primary/10">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4 animate-pulse">
          <Icon name="lucide:zap" class="w-12 h-12 text-primary" />
        </div>
        <h2 class="text-2xl font-black font-rajdhani mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {{ $t('challenges.startCycle') }}
        </h2>
        <p class="text-base-content/60 text-sm">
          {{ $t('challenges.levelUp') }}
        </p>
      </div>
    </div>
  </div>
</template>
