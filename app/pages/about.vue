<script setup lang="ts">
useSeoMeta({
  title: 'About Us | Soul Solutions',
  description:
    'Soul Solutions brings psychiatrists and clinical psychologists together to plan your care jointly, where the science of psychiatry meets the human touch.',
})

/* ---------- Scroll reveal helper ---------- */
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
const { el: teamEl, shown: teamShown } = useReveal(0.08)
const { el: ctaEl, shown: ctaShown } = useReveal(0.3)

const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'
const word = 'mr-[0.26em] inline-block transition-all duration-[900ms] ease-out'

/* ---------- Hero ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
const line1 = ['Where', 'the', 'science', 'of', 'psychiatry']
const line2 = ['meets', 'the', 'human', 'touch.']

/* ---------- Stats ---------- */
const stats = [
  { value: 2, suffix: '', label: 'Disciplines, one team' },
  { value: 5, suffix: '', label: 'Dedicated specialists' },
  { value: 4, suffix: '–5', label: 'Sessions between each joint review' },
  { value: 20, suffix: '+', label: "Years leading our psychiatry team" },
]
const source = ref(0)
const progress = useTransition(source, { duration: 2400 })
watch(statsShown, (v) => {
  if (v) source.value = 1
})

/* ---------- Values → Our approach ---------- */
const values = [
  {
    title: 'Understand early',
    text: 'We look beyond the symptom to identify underlying patterns and traits early, before they grow into bigger difficulties.',
    bg: 'bg-lavender',
    icon: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
  },
  {
    title: 'Strengthen healthy coping',
    text: 'We help you build practical skills and inner resources that support you well beyond the consulting room.',
    bg: 'bg-mint',
    icon: '<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7-6.5 0 4-2.8 6.5-7 6.5Z"/><path d="M12 15c0-3-2.2-5-5.5-5 0 3 2 5 5.5 5Z"/>',
  },
  {
    title: 'Care that prevents',
    text: 'Our aim is not only to treat an illness after it emerges, but to make mental-health care preventive wherever possible.',
    bg: 'bg-peach',
    icon: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    title: 'One plan, together',
    text: 'A psychiatrist and a clinical psychologist plan your care jointly, so nothing about you is seen in isolation.',
    bg: 'bg-sky',
    icon: '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5"/><path d="M11 20c0-3 2.2-5 5-5s5 2 5 5"/>',
  },
]

// Cursor spotlight
const onMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/* ---------- How we work → Care journey ---------- */
const steps = [
  { n: '01', title: 'Joint consultation', text: 'A psychiatrist and a clinical psychologist meet you together, to understand what you are experiencing, why, and what may help.' },
  { n: '02', title: 'Individualized care plan', text: 'You receive a clear plan shaped around you and your story, not a one-size-fits-all template.' },
  { n: '03', title: 'Coordinated care', text: 'Psychiatric consultations and psychotherapy continue side by side, in coordination.' },
  { n: '04', title: 'Joint reviews', text: 'After every four to five sessions, we review progress together and refine the approach.' },
]

/* ---------- Team (Notion ) ---------- */
interface TeamMember {
  id: string
  department: 'psychiatry' | 'psychology'
  name: string
  role: string
  bio: string | null
  photo_url: string | null
}

const { data: team, error: teamError } = await useFetch<TeamMember[]>('/api/team', {
  default: () => [],
})

const groupedTeam = computed(() => team.value ?? [])

const initials = (name: string) =>
  name
    .replace(/^(Dr|Ms|Mr|Mrs)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <div>
    <!-- ============ 1. PAGE HEADER ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-28 pt-36 sm:pt-44 lg:px-10 lg:pb-36">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-16 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
        <div class="absolute bottom-0 left-1/3 h-64 w-64 animate-blob-a rounded-full bg-mint/60 blur-3xl [animation-delay:-8s] max-md:animate-none" />
        <span class="absolute left-[12%] top-[30%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
        <span class="absolute right-[16%] top-[24%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#e89a7a]/70 [animation-delay:2s]" />
        <span class="absolute bottom-[28%] left-[70%] h-2 w-2 animate-twinkle rounded-full bg-violet/40 [animation-delay:4s]" />
      </div>

      <div class="mx-auto max-w-[940px] text-center">
        <nav aria-label="Breadcrumb" class="text-[0.72rem] uppercase tracking-[0.3em] text-plum/70" :class="[base, heroShown ? on : off]">
          <NuxtLink to="/" class="transition-colors hover:text-plum">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span aria-current="page" class="font-medium text-plum">About</span>
        </nav>

        <h1 class="mt-6 font-serif text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[1.08] text-navy">
          <span class="sr-only">Where the science of psychiatry meets the human touch.</span>
          <span aria-hidden="true">
            <span
              v-for="(w, i) in line1"
              :key="'a' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${250 + i * 120}ms` }"
            >{{ w }}</span>
          </span>
          <br />
          <span aria-hidden="true" class="italic">
            <span
              v-for="(w, i) in line2"
              :key="'b' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${900 + i * 130}ms` }"
            ><span class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent">{{ w }}</span></span>
          </span>
        </h1>

        <p
          class="mx-auto mt-7 max-w-[600px] text-[1.02rem] leading-relaxed text-navy/75"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1500ms"
        >
          Soul Solutions brings psychiatrists and clinical psychologists together, so your care is
          understood deeply, planned jointly and delivered as one.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center justify-center gap-4"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1750ms"
        >
          <NuxtLink
            to="/contact"
            class="group inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,92,196,0.5)]"
          >
            Book a Joint Consultation
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

      <svg class="absolute -bottom-px left-0 z-10 h-12 w-full sm:h-16 lg:h-20" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path class="fill-white" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
      </svg>
    </section>

    <!-- ============ 2. OUR STORY  ============ -->
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
              It's okay to feel.
            </p>
          </div>
        </div>

        <!-- Text -->
        <div :class="[base, storyShown ? on : off]" style="transition-delay: 250ms">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our conviction</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Care works best when experts
            <em class="font-medium italic text-plum">think together.</em>
          </h2>
          <p class="mt-6 leading-relaxed text-navy/75">
            Soul Solutions was born from a simple conviction: mental-health care works best when
            psychiatrists and psychologists do not work in isolation, but listen, understand and
            plan care together.
          </p>
          <p class="mt-4 leading-relaxed text-navy/75">
            Emotional distress is rarely caused by a single factor. What appears as a symptom is
            often only the tip of the iceberg, so every person begins with a joint consultation, a
            comprehensive understanding of what they are experiencing, why it may be happening, and
            what may help.
          </p>
          <blockquote class="mt-8 border-l-2 border-violet/50 pl-5 font-serif text-xl italic leading-snug text-navy/85">
            You are not treated as a diagnosis, you are understood as a whole person.
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

    <!-- ============ 4. OUR APPROACH ( "Values" layout) ============ -->
    <section ref="valuesEl" class="bg-cream px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <div class="mx-auto max-w-[640px] text-center" :class="[base, valuesShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our approach</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Not just treating illness, <em class="font-medium italic">but understanding you</em>
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

    <!-- ============ 5. CARE JOURNEY ( "How we work" layout) ============ -->
    <section ref="stepsEl" class="bg-white px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1200px]">
        <div class="mx-auto max-w-[640px] text-center" :class="[base, stepsShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Your care journey</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Planned together, <em class="font-medium italic">reviewed together</em>
          </h2>
        </div>

        <div class="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            class="absolute left-[10%] right-[10%] top-8 hidden origin-left border-t-2 border-dashed border-violet/30 transition-transform duration-[1800ms] ease-out lg:block"
            :class="stepsShown ? 'scale-x-100' : 'scale-x-0'"
            style="transition-delay: 400ms"
            aria-hidden="true"
          />

          <div
            v-for="(s, i) in steps"
            :key="s.n"
            class="relative text-center"
            :class="[base, stepsShown ? on : off]"
            :style="{ transitionDelay: `${300 + i * 220}ms` }"
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

    <!-- ============ 6. TEAM (Notion ) ============ -->
    <section ref="teamEl" class="bg-lavender-soft px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <div class="mx-auto max-w-[640px] text-center" :class="[base, teamShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our team</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            The people who <em class="font-medium italic">care for you</em>
          </h2>
        </div>

        <p v-if="teamError" class="mt-12 text-center text-navy/60">
          Our team details will be available here shortly.
        </p>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(m, i) in groupedTeam"
            :key="m.id"
            :class="[base, teamShown ? on : off]"
            :style="{ transitionDelay: `${150 + i * 140}ms` }"
          >
            <article class="group h-full rounded-[1.75rem] bg-white p-7 text-center shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)]">
              <div class="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-white">
                <img
                  v-if="m.photo_url"
                  :src="m.photo_url"
                  :alt="`Portrait of ${m.name}`"
                  loading="lazy"
                  class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-2xl font-semibold text-plum transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                  aria-hidden="true"
                >
                  {{ initials(m.name) }}
                </div>
              </div>
              <p class="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">
                {{ m.department === 'psychiatry' ? 'Psychiatry' : 'Psychology' }}
              </p>
              <h3 class="mt-1 font-serif text-xl font-semibold text-navy">{{ m.name }}</h3>
              <p class="mt-1 text-sm text-navy/60">{{ m.role }}</p>
              <p v-if="m.bio" class="mt-3 text-[0.88rem] leading-relaxed text-navy/70">{{ m.bio }}</p>
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
            You are not a diagnosis, you are a whole person. Let's build a healthier, happier you,
            together.
          </h2>
          <NuxtLink
            to="/contact"
            class="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(255,255,255,0.35)]"
          >
            Book a Joint Consultation
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>