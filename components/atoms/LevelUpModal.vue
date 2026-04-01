<template>
	<Teleport to="body">
		<dialog class="modal" :open="challenges.isLevelUpModalOpen">
			<div class="modal-box text-center">
				<form method="dialog">
					<button
						class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
						@click="challenges.setIsLevelUpModalOpen(false)"
					>
						x
					</button>
				</form>
				<div class="py-6">
					<div class="text-8xl font-bold font-rajdhani text-primary mb-2">
						{{ challenges.level }}
					</div>
					<svg class="w-16 h-16 mx-auto mb-4 text-warning" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
						/>
					</svg>
					<h3 class="text-2xl font-bold">
						{{ $t('levelUp.congratulations') }}
					</h3>
					<p class="py-2 text-base-content/70">
						{{ $t('levelUp.newLevel') }}
					</p>
				</div>
				<div class="modal-action justify-center">
					<button class="btn btn-primary" @click="challenges.setIsLevelUpModalOpen(false)">
						{{ $t('levelUp.continue') }}
					</button>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button @click="challenges.setIsLevelUpModalOpen(false)">close</button>
			</form>
		</dialog>
	</Teleport>
</template>

<script setup lang="ts">
import { useChallengesStore } from '~/stores/challenges'

const challenges = useChallengesStore()
</script>
