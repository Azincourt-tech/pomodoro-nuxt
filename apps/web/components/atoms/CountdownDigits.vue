<template>
  <div class="w-1/2 flex gap-x-2">
    <span
      v-for="(digit, index) in splittedDigits"
      :key="index"
      class="w-1/2 flex items-center justify-center py-4 text-5xl md:text-7xl lg:text-8xl font-rajdhani font-black text-base-content"
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
