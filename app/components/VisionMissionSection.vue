<script setup lang="ts">
const headingWords = ['Guided', 'by', 'care,']
const headingWords2 = ['driven', 'by', 'hope.']

const missionPoints = [
  'Provide compassionate, professional and confidential care.',
  'Make mental health support accessible, in person and online.',
  'Build a judgment-free space where every feeling is welcome.',
]

// Scroll Animation: when section is in viewport, add class "is-in" to trigger CSS animation
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
useIntersectionObserver(
  root,
  ([entry]) => {
    if (entry?.isIntersecting) visible.value = true
  },
  { threshold: 0.15 },
)

// Mouse move effect: on mousemove, set CSS variables --mx and --my to the mouse position relative to the card
const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section
    id="vission"
    ref="root"
    class="relative overflow-hidden bg-cream px-6 pb-16 pt-14 sm:pt-20 lg:px-10 lg:pb-24"
    :class="{ 'is-in': visible }"
  >
    <!-- Aurora blobs -->
    <div class="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
      <div class="vm-blob-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-lavender/80 blur-3xl" />
      <div class="vm-blob-b absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-peach/70 blur-3xl" />
      <div class="vm-blob-a absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-mint/60 blur-3xl" style="animation-delay: -8s" />

      <!-- Soft floating dots -->
      <span class="vm-dot absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-violet/50" />
      <span class="vm-dot absolute right-[14%] top-[16%] h-1.5 w-1.5 rounded-full bg-[#e89a7a]/70" style="animation-delay: 2s" />
      <span class="vm-dot absolute left-[70%] bottom-[18%] h-2 w-2 rounded-full bg-violet/40" style="animation-delay: 4s" />
      <span class="vm-dot absolute left-[8%] bottom-[26%] h-1.5 w-1.5 rounded-full bg-[#e89a7a]/60" style="animation-delay: 5s" />
    </div>

    <div class="relative z-10 mx-auto max-w-[1240px]">
      <!-- Heading -->
      <div class="mx-auto max-w-[680px] text-center">
        <p
          class="reveal-block text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70"
          style="--d: 0ms"
        >
          Our purpose
        </p>

        <h2 class="mt-4 font-serif text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.1] text-navy">
          <span class="sr-only">Guided by care, driven by hope.</span>
          <span aria-hidden="true">
            <span
              v-for="(w, i) in headingWords"
              :key="w"
              class="reveal-word mr-[0.28em]"
              :style="{ '--d': `${200 + i * 140}ms` }"
            >{{ w }}</span>
          </span>
          <br />
          <span aria-hidden="true" class="italic">
            <span
              v-for="(w, i) in headingWords2"
              :key="w"
              class="reveal-word mr-[0.28em]"
              :style="{ '--d': `${650 + i * 140}ms` }"
            ><span class="vm-shimmer font-medium">{{ w }}</span></span>
          </span>
        </h2>
      </div>

      <!-- Cards -->
      <div class="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
        <!-- Vision -->
        <div class="reveal-block" style="--d: 500ms">
          <article
            class="vm-card group relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-lavender via-lavender-soft to-white p-8 shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(124,92,196,0.22)] sm:p-10"
            @mousemove="onMove"
          >
            <div class="vm-spot pointer-events-none absolute inset-0" aria-hidden="true" />
            <div class="vm-border pointer-events-none absolute inset-0 rounded-[2rem]" aria-hidden="true" />

            <div class="relative z-10">
              <div class="relative h-16 w-16">
                <span class="vm-ring absolute inset-0 rounded-full border border-violet/40" aria-hidden="true" />
                <span class="vm-ring absolute inset-0 rounded-full border border-violet/30" style="animation-delay: 2.5s" aria-hidden="true" />
                <div class="relative flex h-16 w-16 items-center justify-center rounded-[45%_55%_50%_50%] bg-white/80 text-plum transition-transform duration-500 group-hover:-translate-y-1.5">
                  <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>

              <p class="mt-7 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-plum/70">Our Vision</p>
              <h3 class="mt-2 font-serif text-3xl font-semibold leading-tight text-navy sm:text-[2.1rem]">
                A world where every mind feels heard.
              </h3>
              <p class="mt-4 max-w-[460px] leading-relaxed text-navy/75">
                We imagine a future where seeking help is seen as strength, and where everyone has
                the support they need to heal, understand themselves and grow at their own pace.
              </p>
            </div>
          </article>
        </div>

        <!-- Mission -->
        <div class="reveal-block" style="--d: 700ms">
          <article
            class="vm-card group relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-peach via-[#fdf0e8] to-white p-8 shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(232,154,122,0.28)] sm:p-10"
            @mousemove="onMove"
          >
            <div class="vm-spot pointer-events-none absolute inset-0" aria-hidden="true" />
            <div class="vm-border pointer-events-none absolute inset-0 rounded-[2rem]" aria-hidden="true" />

            <div class="relative z-10">
              <div class="relative h-16 w-16">
                <span class="vm-ring absolute inset-0 rounded-full border border-[#e89a7a]/50" aria-hidden="true" />
                <span class="vm-ring absolute inset-0 rounded-full border border-[#e89a7a]/35" style="animation-delay: 2.5s" aria-hidden="true" />
                <div class="relative flex h-16 w-16 items-center justify-center rounded-[50%_50%_45%_55%] bg-white/80 text-plum transition-transform duration-500 group-hover:-translate-y-1.5">
                  <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
                  </svg>
                </div>
              </div>

              <p class="mt-7 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-plum/70">Our Mission</p>
              <h3 class="mt-2 font-serif text-3xl font-semibold leading-tight text-navy sm:text-[2.1rem]">
                Support you, one step at a time.
              </h3>

              <ul class="mt-5 space-y-3">
                <li
                  v-for="(point, i) in missionPoints"
                  :key="point"
                  class="flex items-start gap-3 leading-relaxed text-navy/75"
                >
                  <span
                    class="mt-[0.3rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-plum/15 text-plum"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 16 16" class="vm-tick h-3 w-3" :style="{ '--d': `${1200 + i * 300}ms` }" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                  </span>
                  {{ point }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>