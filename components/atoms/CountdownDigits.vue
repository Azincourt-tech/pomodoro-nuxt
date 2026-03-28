<template>
  <p class="w-1/2 flex gap-x-1">
    <span
      v-for="(digit, index) in splittedDigits"
      :key="index"
      class="w-1/2 bg-white rounded-md flex items-center justify-center py-3"
    >
      {{ digit }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { splitValue } from '~/utils'

const props = defineProps<{
  digits: number
}>()

const splittedDigits = computed(() => splitValue(props.digits))
</script>
