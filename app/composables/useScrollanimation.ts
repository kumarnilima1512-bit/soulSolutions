import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Batch 3-e Journey section-e use hobe. Auto cleanup kore.
export function useScrollAnimation() {
  let ctx: gsap.Context | null = null

  const run = (fn: () => void, scope?: Element | null) => {
    if (!import.meta.client) return
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(fn, scope ?? undefined)
  }

  onBeforeUnmount(() => ctx?.revert())

  return { run, gsap, ScrollTrigger }
}