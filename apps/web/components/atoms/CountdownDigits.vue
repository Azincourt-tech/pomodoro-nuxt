<template>
  <div class="flex gap-x-1 md:gap-x-2">
    <span
      v-for="(digit, index) in splittedDigits"
      :key="index"
      class="w-[2em] md:w-[2.5em] bg-base-200 rounded-2xl flex items-center justify-center py-3 md:py-4 font-rajdhani font-bold text-base-content shadow-inner"
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
