<template>
  <div class="w-1/2 flex gap-x-1 sm:gap-x-2">
    <span
      v-for="(digit, index) in splittedDigits"
      :key="index"
      class="w-1/2 bg-base-200 rounded-xl sm:rounded-2xl flex items-center justify-center py-3 sm:py-4 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-rajdhani font-bold text-base-content shadow-inner"
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
