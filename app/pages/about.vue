<script setup lang="ts">
useSeoMeta({
  title: 'About Us | Soul Solutions',
  description: 'Learn about Soul Solutions, our story, our values and the people who care for you.',
})

/* ---------- Scroll reveal helper (koyekta section-e use hobe) ---------- */
function useReveal(threshold = 0.15) {
  const el = ref<HTMLElement | null>(null)
  const shown = ref(false)
  useIntersectionObserver(
    el,
    ([entry]) => {
      if (entry?.isIntersecting) shown.value = true
    },
    { threshold },
  )
  return { el, shown }
}

const { el: storyEl, shown: storyShown } = useReveal()
const { el: statsEl, shown: statsShown } = useReveal(0.3)
const { el: valuesEl, shown: valuesShown } = useReveal(0.1)
const { el: stepsEl, shown: stepsShown } = useReveal()
const { el: teamEl, shown: teamShown } = useReveal(0.1)
const { el: ctaEl, shown: ctaShown } = useReveal(0.3)

// Tailwind class string-gulo (transition + on/off state)
const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'

/* ---------- Hero (page load-e chalu) ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
const line1 = ['We', 'believe', 'healing', 'is']
const line2 = ['a', 'journey,', 'not', 'a', 'destination.']

/* ---------- Stats count-up ---------- */
// NOTE: ei number gulo placeholder. Nijer real number diye replace koro.
const stats = [
  { value: 5000, suffix: '+', label: 'Sessions held' },
  { value: 40, suffix: '+', label: 'Licensed professionals' },
  { value: 12, suffix: '', label: 'Areas of support' },
  { value: 98, suffix: '%', label: 'Clients feel heard' },
]
const source = ref(0)
const progress = useTransition(source, { duration: 2400 })
watch(statsShown, (v) => {
  if (v) source.value = 1
})

/* ---------- Values ---------- */
const values = [
  {
    title: 'Compassion first',
    text: 'Every conversation begins with warmth, patience and zero judgment.',
    bg: 'bg-lavender',
    icon: '<path d="M12 21s-7-4.6-9.3-9.2C1.2 8.6 3 5 6.5 5c2 0 3.6 1.1 5.5 3 1.9-1.9 3.5-3 5.5-3 3.5 0 5.3 3.6 3.8 6.8C19 16.4 12 21 12 21Z"/>',
  },
  {
    title: 'Safe & confidential',
    text: 'Your story stays yours. Privacy and trust are never negotiable.',
    bg: 'bg-mint',
    icon: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    title: 'Growth at your pace',
    text: 'There are no deadlines in healing. We walk beside you, not ahead.',
    bg: 'bg-peach',
    icon: '<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7-6.5 0 4-2.8 6.5-7 6.5Z"/><path d="M12 15c0-3-2.2-5-5.5-5 0 3 2 5 5.5 5Z"/>',
  },
  {
    title: 'Open to everyone',
    text: 'Every background, identity and story is welcome here.',
    bg: 'bg-sky',
    icon: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14.5c2.4 0 4.2 1.7 4.2 4"/>',
  },
]

// Cursor spotlight: mouse-er position CSS variable-e pathay
const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/* ---------- How we work ---------- */
const steps = [
  { n: '01', title: 'Reach out', text: 'Book a session or send us a message. No pressure, no long forms.' },
  { n: '02', title: 'Get matched', text: 'We pair you with a professional who fits your needs and comfort.' },
  { n: '03', title: 'Begin your journey', text: 'Talk, reflect and grow, in person or online, at your own pace.' },
]

/* ---------- Team ---------- */
// NOTE: placeholder. Real naam, role ar bio diye replace koro.
const team = [
  { initials: 'DN', name: 'Dr. Name Surname', role: 'Clinical Psychologist', grad: 'from-lavender to-violet/40' },
  { initials: 'DN', name: 'Dr. Name Surname', role: 'Counselling Psychologist', grad: 'from-peach to-[#e89a7a]/50' },
  { initials: 'DN', name: 'Name Surname', role: 'Couples Therapist', grad: 'from-mint to-[#7fbfa3]/50' },
  { initials: 'DN', name: 'Name Surname', role: 'Wellness Coach', grad: 'from-sky to-[#7aa6d6]/50' },
]

const word = 'mr-[0.26em] inline-block transition-all duration-[900ms] ease-out'
</script>

<template>
  <div>
    <!-- ============ 1. PAGE HEADER ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-28 pt-36 sm:pt-44 lg:px-10 lg:pb-36">
      <!-- Aurora blobs + dots -->
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-16 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
        <div class="absolute bottom-0 left-1/3 h-64 w-64 animate-blob-a rounded-full bg-mint/60 blur-3xl [animation-delay:-8s] max-md:animate-none" />
        <span class="absolute left-[12%] top-[30%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
        <span class="absolute right-[16%] top-[24%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#e89a7a]/70 [animation-delay:2s]" />
        <span class="absolute bottom-[28%] left-[70%] h-2 w-2 animate-twinkle rounded-full bg-violet/40 [animation-delay:4s]" />
      </div>

      <div class="mx-auto max-w-[900px] text-center">
        <nav aria-label="Breadcrumb" class="text-[0.72rem] uppercase tracking-[0.3em] text-plum/70" :class="[base, heroShown ? on : off]">
          <NuxtLink to="/" class="transition-colors hover:text-plum">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span aria-current="page" class="font-medium text-plum">About</span>
        </nav>

        <h1 class="mt-6 font-serif text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[1.08] text-navy">
          <span class="sr-only">We believe healing is a journey, not a destination.</span>
          <span aria-hidden="true">
            <span
              v-for="(w, i) in line1"
              :key="'a' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${250 + i * 130}ms` }"
            >{{ w }}</span>
          </span>
          <br />
          <span aria-hidden="true" class="italic">
            <span
              v-for="(w, i) in line2"
              :key="'b' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${800 + i * 130}ms` }"
            ><span class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent">{{ w }}</span></span>
          </span>
        </h1>

        <p
          class="mx-auto mt-7 max-w-[560px] text-[1.02rem] leading-relaxed text-navy/75"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1500ms"
        >
          Soul Solutions is a safe, judgment-free space to talk, reflect and grow. Meet the
          people, the values and the story behind our work.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center justify-center gap-4"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1750ms"
        >
          <NuxtLink
            to="/#contact"
            class="group inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,92,196,0.5)]"
          >
            Book a Session
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
          
          <a
            href="#story"
            class="rounded-full border-[1.5px] border-plum/70 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:scale-[1.03] hover:border-violet hover:bg-white/60"
          >
            Our Story
          </a>
        </div>
      </div>

      <!-- Wave -->
      <svg class="absolute -bottom-px left-0 z-10 h-12 w-full sm:h-16 lg:h-20" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path class="fill-white" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
      </svg>
    </section>

    <!-- ============ 2. OUR STORY ============ -->
    <section id="story" ref="storyEl" class="scroll-mt-24 bg-white px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <!-- Image -->
        <div :class="[base, storyShown ? on : off]">
          <div class="relative mx-auto max-w-[480px]">
            <div class="absolute -inset-4 -z-0 rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-lavender via-peach/60 to-transparent blur-sm" aria-hidden="true" />
            <div class="relative aspect-[4/5] animate-float overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] shadow-[0_30px_80px_rgba(63,46,128,0.18)] max-md:animate-none">
              <img
                src="/images/about.png"
                alt="A woman sitting on a hilltop at sunrise with her arms open wide"
                class="h-full w-full object-cover object-[25%_center]"
                loading="lazy"
              />
            </div>
            <p class="absolute -bottom-5 -right-2 rotate-[-6deg] rounded-2xl bg-white px-5 py-3 font-script text-2xl text-plum shadow-[0_12px_40px_rgba(63,46,128,0.15)] sm:-right-6">
              It’s okay to feel.
            </p>
          </div>
        </div>

        <!-- Text -->
        <div :class="[base, storyShown ? on : off]" style="transition-delay: 250ms">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our story</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            It started with one simple question:
            <em class="font-medium italic text-plum">“Who is listening?”</em>
          </h2>
          <p class="mt-6 leading-relaxed text-navy/75">
            Too many people carry their heaviest thoughts alone, because asking for help feels
            complicated, expensive or frightening. Soul Solutions was created to change that, a
            gentle place where support feels natural and reaching out feels safe.
          </p>
          <p class="mt-4 leading-relaxed text-navy/75">
            We bring together licensed therapists and psychologists who believe healing is not a
            straight line. Some days are heavy, some days are light, and every step still counts.
          </p>
          <blockquote class="mt-8 border-l-2 border-violet/50 pl-5 font-serif text-xl italic leading-snug text-navy/85">
            Because healing isn’t a destination, it’s a journey.
          </blockquote>
        </div>
      </div>
    </section>

    <!-- ============ 3. STATS ============ -->
    <section ref="statsEl" class="relative overflow-hidden bg-lavender-soft px-6 py-16 lg:px-10 lg:py-20">
      <div class="pointer-events-none absolute -left-20 top-0 h-60 w-60 animate-blob-b rounded-full bg-lavender blur-3xl max-md:animate-none" aria-hidden="true" />
      <div class="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 animate-blob-a rounded-full bg-peach/60 blur-3xl max-md:animate-none" aria-hidden="true" />

      <dl class="relative mx-auto grid max-w-[1100px] grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          :class="[base, statsShown ? on : off]"
          :style="{ transitionDelay: `${i * 150}ms` }"
        >
          <dd class="order-first font-serif text-5xl font-semibold text-plum sm:text-6xl">
            {{ Math.round(s.value * progress) }}{{ s.suffix }}
          </dd>
          <dt class="mt-2 text-sm text-navy/70">{{ s.label }}</dt>
        </div>
      </dl>
    </section>

    <!-- ============ 4. VALUES ============ -->
    <section ref="valuesEl" class="bg-cream px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <div class="mx-auto max-w-[620px] text-center" :class="[base, valuesShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">What we stand for</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Our values, in <em class="font-medium italic">every session</em>
          </h2>
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(v, i) in values"
            :key="v.title"
            :class="[base, valuesShown ? on : off]"
            :style="{ transitionDelay: `${200 + i * 160}ms` }"
          >
            <article
              class="group relative h-full overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)]"
              @mousemove="onMove"
            >
              <!-- Cursor spotlight -->
              <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_circle_at_var(--mx,50%)_var(--my,50%),rgba(233,228,247,0.9),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div class="relative">
                <div class="relative h-16 w-16">
                  <span class="absolute inset-0 animate-ring rounded-full border border-violet/30 max-md:animate-none" aria-hidden="true" />
                  <div
                    class="relative flex h-16 w-16 items-center justify-center rounded-[45%_55%_50%_50%] text-plum transition-transform duration-500 group-hover:-translate-y-1.5"
                    :class="v.bg"
                  >
                    <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="v.icon" />
                  </div>
                </div>
                <h3 class="mt-6 font-serif text-2xl font-semibold text-navy">{{ v.title }}</h3>
                <p class="mt-2 text-[0.95rem] leading-relaxed text-navy/70">{{ v.text }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 5. HOW WE WORK ============ -->
    <section ref="stepsEl" class="bg-white px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1100px]">
        <div class="mx-auto max-w-[620px] text-center" :class="[base, stepsShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">How we work</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Three gentle steps to <em class="font-medium italic">begin</em>
          </h2>
        </div>

        <div class="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <!-- Dashed connecting line (desktop) -->
          <div
            class="absolute left-[16%] right-[16%] top-8 hidden origin-left border-t-2 border-dashed border-violet/30 transition-transform duration-[1600ms] ease-out md:block"
            :class="stepsShown ? 'scale-x-100' : 'scale-x-0'"
            style="transition-delay: 400ms"
            aria-hidden="true"
          />

          <div
            v-for="(s, i) in steps"
            :key="s.n"
            class="relative text-center"
            :class="[base, stepsShown ? on : off]"
            :style="{ transitionDelay: `${300 + i * 250}ms` }"
          >
            <div class="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lavender to-white font-serif text-xl font-semibold text-plum shadow-[0_10px_30px_rgba(124,92,196,0.2)] ring-4 ring-white">
              {{ s.n }}
            </div>
            <h3 class="mt-6 font-serif text-2xl font-semibold text-navy">{{ s.title }}</h3>
            <p class="mx-auto mt-2 max-w-[260px] text-[0.95rem] leading-relaxed text-navy/70">{{ s.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 6. TEAM ============ -->
    <section ref="teamEl" class="bg-lavender-soft px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <div class="mx-auto max-w-[620px] text-center" :class="[base, teamShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our team</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            The people who <em class="font-medium italic">care for you</em>
          </h2>
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(m, i) in team"
            :key="i"
            :class="[base, teamShown ? on : off]"
            :style="{ transitionDelay: `${200 + i * 160}ms` }"
          >
            <article class="group h-full rounded-[1.75rem] bg-white p-7 text-center shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)]">
              <div
                class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br font-serif text-3xl font-semibold text-plum ring-4 ring-white transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                :class="m.grad"
              >
                {{ m.initials }}
              </div>
              <h3 class="mt-5 font-serif text-xl font-semibold text-navy">{{ m.name }}</h3>
              <p class="mt-1 text-sm text-navy/60">{{ m.role }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 7. CTA ============ -->
    <section ref="ctaEl" class="bg-cream px-6 py-16 lg:px-10 lg:py-24">
      <div
        class="relative mx-auto max-w-[1100px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2d2660] via-plum to-[#6b4fb0] px-8 py-16 text-center shadow-[0_30px_80px_rgba(63,46,128,0.35)] sm:px-16 sm:py-20"
        :class="[base, ctaShown ? on : off]"
      >
        <!-- Stars -->
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <span class="absolute left-[10%] top-[18%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
          <span class="absolute left-[28%] top-[70%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:1.5s]" />
          <span class="absolute right-[12%] top-[24%] h-2 w-2 animate-twinkle rounded-full bg-white [animation-delay:3s]" />
          <span class="absolute right-[30%] top-[78%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white [animation-delay:4.5s]" />
          <span class="absolute left-[55%] top-[12%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2.2s]" />
          <div class="absolute -bottom-24 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-full bg-[#e89a7a]/25 blur-3xl" />
        </div>

        <div class="relative">
          <p class="font-script text-3xl text-white/85 sm:text-4xl">Small steps. Big changes.</p>
          <h2 class="mx-auto mt-4 max-w-[640px] font-serif text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.15] text-white">
            Your mental health matters. Let’s build a healthier, happier you, together.
          </h2>
          <NuxtLink
            to="/#contact"
            class="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(255,255,255,0.35)]"
          >
            Book a Session
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>