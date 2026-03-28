<template>
  <div class="flex justify-center items-center text-6xl md:text-8xl lg:text-9xl font-rajdhani font-bold text-base-content">
    <CountdownDigits :digits="countdown.minutes" />
    <span class="px-1 md:px-3 text-primary animate-pulse">:</span>
    <CountdownDigits :digits="countdown.seconds" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

const emit = defineEmits<{ completed: [] }>()
const countdown = useCountdownStore()

let TIMEOUT_REFERENCE: ReturnType<typeof setTimeout>

function runCountdown(flag: boolean) {
  if (countdown.isActive && flag) {
    TIMEOUT_REFERENCE = setTimeout(() => countdown.setTime(countdown.time - 1), 1000)
  } else {
    clearTimeout(TIMEOUT_REFERENCE)
  }
}

watch(() => countdown.isActive, (v) => {
  runCountdown(v)
  if (!v) countdown.resetTime()
})

watch(() => countdown.time, (v) => {
  if (v > 0) runCountdown(true)
  else emit('completed')
})
</script>
