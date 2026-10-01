import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


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