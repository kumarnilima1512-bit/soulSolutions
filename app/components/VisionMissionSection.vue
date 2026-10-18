<script setup lang="ts">
const headingWords = ['Guided', 'by', 'care,']
const headingWords2 = ['driven', 'by', 'hope.']
const missionLines = ['Space to heal.', 'Support to understand.', 'Freedom to grow.']

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
      <div class="mx-auto max-w-[860px] text-center">
        <p
          class="reveal-block text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70"
          style="--d: 0ms"
        >
          Our purpose
        </p>

        <h2 class="mt-4 font-serif text-[clamp(1.6rem,3.6vw,2.8rem)] font-semibold leading-[1.2] text-navy">
          <span class="sr-only">Guided by care, driven by hope.</span>
          <span aria-hidden="true">
            <span
              v-for="(w, i) in headingWords"
              :key="'a' + i"
              class="reveal-word mr-[0.28em]"
              :style="{ '--d': `${200 + i * 100}ms` }"
            >{{ w }}</span>
          </span>
          <br />
          <span aria-hidden="true" class="italic">
            <span
              v-for="(w, i) in headingWords2"
              :key="'b' + i"
              class="reveal-word mr-[0.28em]"
              :style="{ '--d': `${750 + i * 90}ms` }"
            ><span class="vm-shimmer font-medium">{{ w }}</span></span>
          </span>
        </h2>
      </div>

      <!-- Cards (side by side on mobile too) -->
      <div class="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:gap-8">
        <!-- Vision -->
        <div class="reveal-block" style="--d: 500ms">
          <article
            class="vm-card group relative h-full overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-lavender via-lavender-soft to-white p-4 shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(124,92,196,0.22)] sm:rounded-[2rem] sm:p-8 lg:p-10"
            @mousemove="onMove"
          >
            <div class="vm-spot pointer-events-none absolute inset-0" aria-hidden="true" />
            <div class="vm-border pointer-events-none absolute inset-0 rounded-[1.25rem] sm:rounded-[2rem]" aria-hidden="true" />

            <div class="relative z-10">
              <div class="relative h-11 w-11 sm:h-16 sm:w-16">
                <span class="vm-ring absolute inset-0 rounded-full border border-violet/40" aria-hidden="true" />
                <span class="vm-ring absolute inset-0 rounded-full border border-violet/30" style="animation-delay: 2.5s" aria-hidden="true" />
                <div class="relative flex h-11 w-11 items-center justify-center rounded-[45%_55%_50%_50%] bg-white/80 text-plum transition-transform duration-500 group-hover:-translate-y-1.5 sm:h-16 sm:w-16">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 sm:h-8 sm:w-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>

              <p class="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-plum/70 sm:mt-7 sm:text-[0.7rem] sm:tracking-[0.28em]">We see the whole you</p>
              <h3 class="mt-2 font-serif text-lg font-semibold leading-tight text-navy sm:text-2xl lg:text-[1.8rem]">
                Care that sees the whole person, not the worst week.
              </h3>
              <p class="mt-3 max-w-[480px] text-[0.75rem] leading-relaxed text-navy/75 sm:mt-4 sm:text-base">
                Most people reach a clinic at their lowest point, and get treated for that moment
                alone. We want to change where care begins — identifying patterns early, building
                skills that hold up in ordinary life, and making prevention a real part of mental
                health rather than an afterthought.
              </p>
            </div>
          </article>
        </div>

        <!-- Mission -->
        <div class="reveal-block" style="--d: 700ms">
          <article
            class="vm-card group relative h-full overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-peach via-[#fdf0e8] to-white p-4 shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(232,154,122,0.28)] sm:rounded-[2rem] sm:p-8 lg:p-10"
            @mousemove="onMove"
          >
            <div class="vm-spot pointer-events-none absolute inset-0" aria-hidden="true" />
            <div class="vm-border pointer-events-none absolute inset-0 rounded-[1.25rem] sm:rounded-[2rem]" aria-hidden="true" />

            <div class="relative z-10">
              <div class="relative h-11 w-11 sm:h-16 sm:w-16">
                <span class="vm-ring absolute inset-0 rounded-full border border-[#e89a7a]/50" aria-hidden="true" />
                <span class="vm-ring absolute inset-0 rounded-full border border-[#e89a7a]/35" style="animation-delay: 2.5s" aria-hidden="true" />
                <div class="relative flex h-11 w-11 items-center justify-center rounded-[50%_50%_45%_55%] bg-white/80 text-plum transition-transform duration-500 group-hover:-translate-y-1.5 sm:h-16 sm:w-16">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 sm:h-8 sm:w-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
                  </svg>
                </div>
              </div>

              <p class="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-plum/70 sm:mt-7 sm:text-[0.7rem] sm:tracking-[0.28em]">Our Mission</p>
              <h3 class="mt-2 font-serif text-lg font-semibold leading-tight text-navy sm:text-2xl lg:text-[1.8rem]">
                <span v-for="line in missionLines" :key="line" class="block">{{ line }}</span>
              </h3>

              <p class="mt-3 max-w-[480px] text-[0.75rem] leading-relaxed text-navy/75 sm:mt-4 sm:text-base">
                Our mission is to combine compassionate care with scientific understanding, helping
                people navigate distress, understand themselves and move towards a life that feels
                meaningful to them.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>