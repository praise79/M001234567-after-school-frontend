<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let dispose = () => {}

onMounted(() => {
  const element = canvas.value
  if (!element) return

  const context = element.getContext('2d')
  if (!context) return

  let width = 0
  let height = 0
  let frame = 0
  let lastTime = 0
  let resizeTimer
  let stopped = false
  const webs = []

  function createWeb(x, y, radius, rings, spokes, phase) {
    return { x, y, radius, rings, spokes, phase }
  }

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    element.width = Math.round(width * dpr)
    element.height = Math.round(height * dpr)
    element.style.width = `${width}px`
    element.style.height = `${height}px`
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    webs.splice(0, webs.length,
      createWeb(width * .04, height * .08, Math.min(width, height) * .27, 5, 13, .5),
      createWeb(width * .96, height * .19, Math.min(width, height) * .22, 4, 12, 1.9),
      createWeb(width * .12, height * .94, Math.min(width, height) * .24, 4, 11, 3.2),
      createWeb(width * .91, height * .88, Math.min(width, height) * .3, 5, 14, 4.4),
    )
  }

  function draw(time) {
    if (stopped) return
    if (time - lastTime < 1000 / 30) {
      frame = requestAnimationFrame(draw)
      return
    }
    lastTime = time
    context.clearRect(0, 0, width, height)

    const dark = document.documentElement.dataset.theme === 'dark'
    const color = dark ? '245, 245, 245' : '0, 107, 98'
    const motion = time * .00035

    webs.forEach((web, webIndex) => {
      context.lineWidth = .65
      context.lineCap = 'round'

      for (let spoke = 0; spoke < web.spokes; spoke += 1) {
        const angle = (Math.PI * 2 * spoke) / web.spokes + web.phase
        context.beginPath()
        context.moveTo(web.x, web.y)
        context.lineTo(web.x + Math.cos(angle) * web.radius, web.y + Math.sin(angle) * web.radius)
        context.strokeStyle = `rgba(${color}, ${dark ? .12 : .08})`
        context.stroke()
      }

      for (let ring = 1; ring <= web.rings; ring += 1) {
        const radius = (web.radius / web.rings) * ring
        context.beginPath()
        for (let spoke = 0; spoke <= web.spokes; spoke += 1) {
          const angle = (Math.PI * 2 * spoke) / web.spokes + web.phase
          const wave = Math.sin(motion * 2 + ring * .7 + spoke * .8 + webIndex) * (ring * .7)
          const pointX = web.x + Math.cos(angle) * (radius + wave)
          const pointY = web.y + Math.sin(angle) * (radius + wave)
          if (spoke === 0) context.moveTo(pointX, pointY)
          else context.lineTo(pointX, pointY)
        }
        context.strokeStyle = `rgba(${color}, ${dark ? .16 : .1})`
        context.stroke()
      }
    })

    frame = requestAnimationFrame(draw)
  }

  function handleResize() {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 160)
  }

  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      frame = 0
    } else if (!frame) {
      lastTime = 0
      frame = requestAnimationFrame(draw)
    }
  }

  resize()
  frame = requestAnimationFrame(draw)
  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)

  dispose = () => {
    stopped = true
    cancelAnimationFrame(frame)
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibility)
  }
})

onUnmounted(() => dispose())
</script>

<template>
  <canvas ref="canvas" class="cobweb-canvas" aria-hidden="true"></canvas>
</template>

<style scoped>
.cobweb-canvas {
  position: fixed;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: .7;
}

@media (max-width: 600px) {
  .cobweb-canvas { opacity: .45; }
}

@media (prefers-reduced-motion: reduce) {
  .cobweb-canvas { display: none; }
}
</style>
