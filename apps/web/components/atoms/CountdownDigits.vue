<template>
  <div class="w-1/2 flex gap-x-2">
    <span
      v-for="(digit, index) in splittedDigits"
      :key="index"
      class="w-1/2 bg-gradient-to-br from-base-200 to-base-300/80 rounded-2xl flex items-center justify-center py-4 text-5xl md:text-7xl lg:text-8xl font-rajdhani font-black text-base-content shadow-xl border border-base-300/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/20"
    >
      {{ digit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { splitValue } from '~/utils'

const props = defineProps<{ digits: number }>()
const splittedDigits = computed(() => splitValue(props.digits))
</script>
