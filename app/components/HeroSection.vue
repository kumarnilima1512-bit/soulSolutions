<script setup lang="ts">
const { layerStyle } = useParallax()
const reduceMotion = usePreferredReducedMotion()
</script>

<template>
  <section
    id="home"
    class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb]"
  >
    <!-- Text column -->
    <div class="relative z-10 mx-auto max-w-[1240px] px-6 pb-10 pt-32 sm:pt-36 lg:min-h-[720px] lg:px-10 lg:pb-36 lg:pt-44">
      <div class="max-w-[560px]">
        <p
          class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70"
          v-motion
          :initial="{ opacity: 0, y: 12 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
        >
          Your mind matters
        </p>

        <h1
          class="mt-5 font-serif text-[clamp(3rem,6.2vw,5.2rem)] font-semibold leading-[1.02] text-navy"
          v-motion
          :initial="{ opacity: 0, y: 32 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 900, delay: 300 } }"
        >
          Soul Solutions
        </h1>

        <p
          class="mt-3 font-serif text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.2] text-navy/90"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 900, delay: 650 } }"
        >
          Because healing isn’t a destination,<br />
          <em class="italic">it’s a journey.</em>
        </p>

        <p
          class="mt-7 max-w-[420px] text-[0.98rem] leading-relaxed text-navy/75"
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 950 } }"
        >
          A safe, judgment-free space to talk, reflect and grow. We’re here to support your
          mental well-being — one step at a time.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center gap-4"
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 1250 } }"
        >
          <a
            href="#contact"
            class="group inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,92,196,0.5)]"
          >
            Start Your Journey
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <a
            href="/about"
            class="rounded-full border-[1.5px] border-plum/70 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:scale-[1.03] hover:border-violet hover:bg-white/60"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>

    <!-- Illustration -->
        <!-- Illustration -->
    <div
      class="hero-mask relative h-[380px] sm:h-[460px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[68%]"
    >
      <div class="absolute -inset-[3%]" :style="layerStyle(6)">
        <!-- Reduced motion hole shudhu still image -->
        <img
          v-if="reduceMotion === 'reduce'"
          src="/images/hero.png"
          alt="A woman sitting on a hilltop at sunrise with her arms open wide, a book and a cup beside her"
          class="h-full w-full object-cover object-[70%_center]"
        />

        <!-- Normal: looping video (poster = video load howar age image dekhay) -->
        <video
          v-else
          class="h-full w-full object-cover object-[70%_center]"
          src="/video/hero.mp4"
          poster="/images/hero.png"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          aria-label="A woman sitting on a hilltop at sunrise with her arms open wide"
        />
      </div>

      <!-- Handwritten text -->
      <!-- <p
        class="pointer-events-none absolute right-[6%] top-[8%] -rotate-[10deg] font-script text-2xl text-white sm:text-3xl [text-shadow:0_2px_12px_rgba(63,46,128,0.55)]"
        :style="layerStyle(3)"
      >
        It’s okay<br />to feel.
      </p> -->
    </div>

    <!-- Organic wave (cream = Benefits section-er bg) -->
    <svg
      class="absolute -bottom-px left-0 z-20 h-12 w-full sm:h-16 lg:h-20"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path class="fill-cream" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
    </svg>
  </section>
</template>