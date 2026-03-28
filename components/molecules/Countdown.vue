<template>
  <div class="flex justify-center items-center mt-8 lg:mt-14 text-9xl text-title font-rajdhani">
    <CountdownDigits :digits="countdown.minutes" />
    <span class="bg-background px-2">:</span>
    <CountdownDigits :digits="countdown.seconds" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCountdownStore } from '~/stores/countdown'
import CountdownDigits from '~/components/atoms/CountdownDigits.vue'

const emit = defineEmits<{
  completed: []
}>()

const countdown = useCountdownStore()

let TIMEOUT_REFERENCE: ReturnType<typeof setTimeout>

function runCountdown(flag: boolean) {
  if (countdown.isActive && flag) {
    TIMEOUT_REFERENCE = setTimeout(() => {
      countdown.setTime(countdown.time - 1)
    }, 1000)
  } else {
    clearTimeout(TIMEOUT_REFERENCE)
  }
}

watch(() => countdown.isActive, (newValue) => {
  runCountdown(newValue)
  if (!newValue) {
    countdown.resetTime()
  }
})

watch(() => countdown.time, (newValue) => {
  if (newValue > 0) {
    runCountdown(true)
  } else {
    emit('completed')
  }
})
</script>
