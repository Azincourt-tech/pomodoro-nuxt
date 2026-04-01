<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()

useHead({
	htmlAttrs: {
		'data-theme': computed(() => theme.currentTheme)
	}
})
</script>
