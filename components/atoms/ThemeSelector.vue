<template>
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body p-4">
			<div class="flex items-center gap-2 mb-3">
				<svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
					/>
				</svg>
				<h3 class="font-semibold text-sm">
					{{ $t('nav.theme') }}
				</h3>
			</div>

			<div class="space-y-1">
				<button
					v-for="t in themes"
					:key="t"
					class="w-full flex items-baseline gap-3 px-3 py-2 rounded-lg transition-all duration-200"
					:class="
						theme.currentTheme === t ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-base-200'
					"
					@click="theme.setTheme(t)"
				>
					<span
						class="w-6 h-6 rounded-full shrink-0 self-center shadow-sm ring-1 ring-base-300 transition-transform duration-200"
						:class="[previewColor(t), theme.currentTheme === t ? 'scale-110' : '']"
					/>
					<span class="capitalize text-sm font-medium flex-1 text-left">{{ t }}</span>
					<svg
						v-if="theme.currentTheme === t"
						class="w-4 h-4 text-primary self-center"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useThemeStore, AVAILABLE_THEMES } from '~/stores/theme'

const theme = useThemeStore()
const themes = AVAILABLE_THEMES

function previewColor(t: string) {
	const map: Record<string, string> = {
		light: 'bg-gray-100 border border-gray-300',
		dark: 'bg-gray-900',
		cupcake: 'bg-pink-200',
		dracula: 'bg-purple-900',
		synthwave: 'bg-fuchsia-600',
		retro: 'bg-orange-200',
		cyberpunk: 'bg-yellow-400',
		valentine: 'bg-pink-400',
		aqua: 'bg-cyan-400',
		lofi: 'bg-gray-300'
	}
	return map[t] || 'bg-gray-400'
}
</script>
