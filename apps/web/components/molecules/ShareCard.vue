<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
  >
    <div class="modal-box max-w-md">
      <h3 class="text-lg font-bold font-rajdhani mb-4">
        {{ $t('share.title') }}
      </h3>

      <!-- Canvas for share card -->
      <div class="flex justify-center mb-4">
        <canvas
          ref="canvasRef"
          width="600"
          height="400"
          class="rounded-xl max-w-full"
        />
      </div>

      <div class="flex gap-3">
        <button
          v-if="canShare"
          class="btn btn-primary flex-1"
          @click="shareNative"
        >
          {{ $t('share.button') }}
        </button>
        <button
          class="btn btn-outline flex-1"
          @click="downloadImage"
        >
          {{ $t('share.download') }}
        </button>
      </div>

      <div class="modal-action">
        <button
          class="btn btn-sm"
          @click="close"
        >
          {{ $t('shortcuts.close') }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
      @click="close"
    >
      <button>{{ $t('shortcuts.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface ShareStats {
  level: number
  xp: number
  completedChallenges: number
  streakCurrent: number
  streakBest: number
  totalSessions: number
  totalTime: number
  userName: string
}

const props = defineProps<{
  stats: ShareStats
}>()

const isOpen = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const canShare = computed(() => {
  return typeof navigator !== 'undefined' && 'share' in navigator
})

function drawCard() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h)
  gradient.addColorStop(0, '#1e1b4b')
  gradient.addColorStop(1, '#312e81')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, 16)
  ctx.fill()

  // App title
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 24px Inter, sans-serif'
  ctx.fillText('Pomodoro Move.it', 30, 50)

  // User name
  ctx.fillStyle = '#a5b4fc'
  ctx.font = '16px Inter, sans-serif'
  ctx.fillText(props.stats.userName, 30, 78)

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.beginPath()
  ctx.moveTo(30, 100)
  ctx.lineTo(w - 30, 100)
  ctx.stroke()

  // Stats
  const statsItems = [
    { label: 'Level', value: `${props.stats.level}`, color: '#fbbf24' },
    { label: 'XP', value: `${props.stats.xp}`, color: '#34d399' },
    { label: 'Challenges', value: `${props.stats.completedChallenges}`, color: '#60a5fa' },
    { label: 'Streak', value: `${props.stats.streakCurrent}d`, color: '#f87171' },
  ]

  const colWidth = (w - 60) / 4
  statsItems.forEach((item, i) => {
    const x = 30 + i * colWidth + colWidth / 2

    ctx.fillStyle = item.color
    ctx.font = 'bold 32px Rajdhani, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(item.value, x, 160)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '12px Inter, sans-serif'
    ctx.fillText(item.label, x, 185)
  })

  ctx.textAlign = 'left'

  // Bottom section
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  ctx.beginPath()
  ctx.roundRect(20, 220, w - 40, 150, 12)
  ctx.fill()

  // Summary text
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '16px Inter, sans-serif'
  ctx.fillText(`Total sessions: ${props.stats.totalSessions}`, 40, 260)
  ctx.fillText(`Focused time: ${props.stats.totalTime} minutes`, 40, 290)
  ctx.fillText(`Best streak: ${props.stats.streakBest} days`, 40, 320)

  // Fire emoji for streak
  if (props.stats.streakCurrent >= 3) {
    ctx.font = '28px sans-serif'
    const fireCount = props.stats.streakCurrent >= 30 ? 3 : props.stats.streakCurrent >= 7 ? 2 : 1
    ctx.fillText('\u{1F525}'.repeat(fireCount), w - 120, 265)
  }

  // Bottom branding
  ctx.fillStyle = '#64748b'
  ctx.font = '11px Inter, sans-serif'
  ctx.fillText('pomodoro-move.it', 40, h - 25)
}

async function shareNative() {
  drawCard()
  const canvas = canvasRef.value
  if (!canvas) return

  try {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png')
    })
    const file = new File([blob], 'pomodoro-stats.png', { type: 'image/png' })
    await navigator.share({
      title: 'Pomodoro Move.it',
      text: `Level ${props.stats.level} | ${props.stats.totalSessions} sessions | ${props.stats.streakCurrent} day streak!`,
      files: [file],
    })
  }
  catch {
    // User cancelled or share failed
  }
}

function downloadImage() {
  drawCard()
  const canvas = canvasRef.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = 'pomodoro-stats.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function open() {
  isOpen.value = true
  // Draw after DOM updates
  setTimeout(drawCard, 100)
}

function close() {
  isOpen.value = false
}

defineExpose({ open, close })
</script>
