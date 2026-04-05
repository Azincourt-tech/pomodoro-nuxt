<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :class="{ 'modal-open': isOpen }"
  >
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="modal-box max-w-md p-0 overflow-hidden relative bg-gradient-to-br from-base-100 via-base-100/95 to-base-200/80 backdrop-blur-xl border border-primary/25 shadow-2xl rounded-2xl">
        <!-- Decorative background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-secondary/15 to-primary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
        </div>

        <!-- Header -->
        <div class="relative z-10 bg-gradient-to-r from-primary to-secondary p-5 flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon name="lucide:share-2" class="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <h3 class="text-xl font-black text-white">{{ $t('share.title') }}</h3>
          </div>
          <button
            class="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 transition-all"
            @click="close"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Canvas for share card -->
        <div class="relative z-10 p-5">
          <div class="bg-gradient-to-br from-base-200/60 to-base-300/40 rounded-2xl border border-base-300/30 p-4 shadow-inner">
            <canvas
              ref="canvasRef"
              width="600"
              height="400"
              class="rounded-xl max-w-full shadow-lg"
            />
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3 mt-4">
            <button
              v-if="canShare"
              class="btn btn-primary btn-sm flex-nowrap gap-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              @click="shareNative"
            >
              <Icon name="lucide:share" class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span class="font-semibold text-xs whitespace-nowrap">{{ $t('share.button', 'Compartilhar') }}</span>
            </button>
            <button
              class="btn btn-outline btn-sm flex-nowrap gap-1.5 hover:bg-base-200/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 group"
              @click="downloadImage"
            >
              <Icon name="lucide:download" class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span class="font-semibold text-xs whitespace-nowrap">{{ $t('share.download', 'Baixar') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

  // Background gradient - vibrant purple/indigo
  const gradient = ctx.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, '#1e1b4b')
  gradient.addColorStop(0.5, '#312e81')
  gradient.addColorStop(1, '#3730a3')
  ctx.fillStyle = gradient
  ctx.beginPath()
  
  // Rounded corners
  const radius = 20
  ctx.moveTo(radius, 0)
  ctx.lineTo(w - radius, 0)
  ctx.quadraticCurveTo(w, 0, w, radius)
  ctx.lineTo(w, h - radius)
  ctx.quadraticCurveTo(w, h, w - radius, h)
  ctx.lineTo(radius, h)
  ctx.quadraticCurveTo(0, h, 0, h - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fill()

  // Decorative circles
  ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
  ctx.beginPath()
  ctx.arc(w - 50, 50, 40, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = 'rgba(139, 92, 246, 0.08)'
  ctx.beginPath()
  ctx.arc(50, h - 50, 60, 0, Math.PI * 2)
  ctx.fill()

  // App title with glow - increased top padding
  ctx.shadowColor = 'rgba(99, 102, 241, 0.5)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 26px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Pomodoro Move.it', 40, 55)
  ctx.shadowBlur = 0

  // User name
  ctx.fillStyle = '#a5b4fc'
  ctx.font = 'bold 15px Inter, sans-serif'
  ctx.fillText(`@${props.stats.userName}`, 40, 82)

  // Divider with gradient
  const divGradient = ctx.createLinearGradient(30, 0, w - 30, 0)
  divGradient.addColorStop(0, 'rgba(99, 102, 241, 0)')
  divGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)')
  divGradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
  ctx.strokeStyle = divGradient
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(30, 95)
  ctx.lineTo(w - 30, 95)
  ctx.stroke()

  // Stats in grid
  const statsItems = [
    { label: t('share.level'), value: `${props.stats.level}`, color: '#fbbf24', icon: '⭐' },
    { label: t('share.xp'), value: `${props.stats.xp}`, color: '#34d399', icon: '✨' },
    { label: t('share.challenges'), value: `${props.stats.completedChallenges}`, color: '#60a5fa', icon: '🎯' },
    { label: t('share.streak'), value: `${props.stats.streakCurrent}d`, color: '#f87171', icon: '🔥' },
  ]

  const colWidth = (w - 60) / 4
  statsItems.forEach((item, i) => {
    const x = 30 + i * colWidth + colWidth / 2

    // Icon
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(item.icon, x, 145)

    // Value
    ctx.fillStyle = item.color
    ctx.shadowColor = item.color
    ctx.shadowBlur = 15
    ctx.font = 'bold 36px Rajdhani, sans-serif'
    ctx.fillText(item.value, x, 185)
    ctx.shadowBlur = 0

    // Label
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px Inter, sans-serif'
    ctx.fillText(item.label.toUpperCase(), x, 210)
  })

  ctx.textAlign = 'left'

  // Bottom section with glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  const bottomRadius = 12
  const bx = 20, by = 235, bw = w - 40, bh = 140
  ctx.moveTo(bx + bottomRadius, by)
  ctx.lineTo(bx + bw - bottomRadius, by)
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + bottomRadius)
  ctx.lineTo(bx + bw, by + bh - bottomRadius)
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - bottomRadius, by + bh)
  ctx.lineTo(bx + bottomRadius, by + bh)
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - bottomRadius)
  ctx.lineTo(bx, by + bottomRadius)
  ctx.quadraticCurveTo(bx, by, bx + bottomRadius, by)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Summary text
  const summaryItems = [
    { label: t('share.totalSessions'), value: props.stats.totalSessions, icon: '📅' },
    { label: t('share.focusedTime'), value: `${props.stats.totalTime} ${t('share.minutes')}`, icon: '⏱️' },
    { label: t('share.bestStreak'), value: `${props.stats.streakBest} ${t('share.days')}`, icon: '🏆' },
  ]

  summaryItems.forEach((item, i) => {
    const y = 275 + i * 35
    
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(item.icon, 35, y)
    
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '14px Inter, sans-serif'
    ctx.fillText(`${item.label}:`, 60, y)
    
    ctx.fillStyle = '#f1f5f9'
    ctx.font = 'bold 16px Inter, sans-serif'
    ctx.fillText(`${item.value}`, 180, y)
  })

  // Fire emoji for streak
  if (props.stats.streakCurrent >= 3) {
    ctx.font = '32px sans-serif'
    const fireCount = props.stats.streakCurrent >= 30 ? 3 : props.stats.streakCurrent >= 7 ? 2 : 1
    ctx.fillText('\u{1F525}'.repeat(fireCount), w - 100, 275)
  }

  // Bottom branding
  ctx.fillStyle = '#64748b'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('pomodoro-move.it', w / 2, h - 20)
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
  link.download = `pomodoro-stats-${Date.now()}.png`
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
