<template>
  <Icon :icon="name" :class="class" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  class?: string
}>()
</script>
