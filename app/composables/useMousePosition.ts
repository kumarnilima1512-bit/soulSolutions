// Desktop + mouse + no reduced-motion hole tobei enabled hoy.
// x, y: -1 theke 1, smooth (lerp) kora.
export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)
  const enabled = ref(false)

  let targetX = 0
  let targetY = 0
  let raf = 0

  const onMove = (e: MouseEvent) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2
    targetY = (e.clientY / window.innerHeight - 0.5) * 2
  }

  const loop = () => {
    x.value += (targetX - x.value) * 0.06
    y.value += (targetY - y.value) * 0.06
    raf = requestAnimationFrame(loop)
  }

  onMounted(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)',
    )
    enabled.value = mq.matches
    if (!enabled.value) return
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMove)
    cancelAnimationFrame(raf)
  })

  return { x, y, enabled }
}