<script setup lang="ts">
useSeoMeta({
  title: 'About Us | Soul Solutions',
  description:
    'Meet the founders and the team behind Soul Solutions, psychiatrists and clinical psychologists who plan your care together.',
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

const { el: foundersEl, shown: foundersShown } = useReveal(0.1)
const { el: teamEl, shown: teamShown } = useReveal(0.08)
const { el: ctaEl, shown: ctaShown } = useReveal(0.3)

const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'
const word = 'mr-[0.26em] inline-block transition-all duration-[900ms] ease-out'

/* ---------- Hero ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
const line1 = ['The', 'people', 'behind']
const line2 = ['Soul', 'Solutions.']

/* ---------- Members (Notion) ---------- */
interface Member {
  id: string
  name: string
  role: string
  department: 'psychiatry' | 'psychology'
  is_founder: boolean
  qualifications: string
  experience_years: number | null
  institutions: string[]
  specializations: string[]
  bio: string | null
  photo_url: string | null
}

const { data: members, error: membersError } = await useFetch<Member[]>('/api/about-team', {
  default: () => [],
})

// Development only: shows the real reason when the API fails
const errorHint = computed(() =>
  import.meta.dev ? (membersError.value as any)?.statusMessage || (membersError.value as any)?.message || '' : '',
)

const founders = computed(() => (members.value ?? []).filter((m) => m.is_founder))
const team = computed(() => (members.value ?? []).filter((m) => !m.is_founder))

const departmentLabel = (d: Member['department']) => (d === 'psychiatry' ? 'Psychiatry' : 'Psychology')

const initials = (name: string) =>
  name
    .replace(/^(Dr|Ms|Mr|Mrs)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/* ---------- Profile dialog (team members) ---------- */
const selected = ref<Member | null>(null)
onKeyStroke('Escape', () => (selected.value = null))
watch(selected, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
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
          <span aria-current="page" class="font-medium text-plum">Know About Us</span>
        </nav>

        <h1 class="mt-6 font-serif text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[1.08] text-navy">
          <span class="sr-only">The people behind Soul Solutions.</span>
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
              :style="{ transitionDelay: `${700 + i * 130}ms` }"
            ><span class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent">{{ w }}</span></span>
          </span>
        </h1>

        <p
          class="mx-auto mt-7 max-w-[600px] text-[1.02rem] leading-relaxed text-navy/75"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1300ms"
        >
          Meet the founders and the specialists who listen, understand and plan your care
          together, so you are always seen as a whole person.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center justify-center gap-4"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1550ms"
        >
          <NuxtLink
            to="/book"
            class="group inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,92,196,0.5)]"
          >
            Book a Joint Consultation
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
          <a
            href="#founders"
            class="rounded-full border-[1.5px] border-plum/70 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:scale-[1.03] hover:border-violet hover:bg-white/60"
          >
            Meet the Founders
          </a>
        </div>
      </div>

      <svg class="absolute -bottom-px left-0 z-10 h-12 w-full sm:h-16 lg:h-20" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path class="fill-white" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
      </svg>
    </section>

    <!-- ============ 2. FOUNDERS ============ -->
    <section id="founders" ref="foundersEl" class="scroll-mt-24 bg-white px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1100px]">
        <div class="mx-auto max-w-[640px] text-center" :class="[base, foundersShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our founders</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Where it all <em class="font-medium italic">began</em>
          </h2>
        </div>

        <p v-if="membersError" class="mt-12 text-center text-navy/60">
          Our founders' details will be available here shortly.
          <span v-if="errorHint" class="mt-2 block text-xs text-red-500">[dev] {{ errorHint }}</span>
        </p>

        <div class="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 lg:gap-8">
          <div
            v-for="(f, i) in founders"
            :key="f.id"
            :class="[base, foundersShown ? on : off]"
            :style="{ transitionDelay: `${200 + i * 180}ms` }"
          >
            <article class="group relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-lavender-soft via-white to-[#fff6ee] p-8 shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)] sm:p-10">
              <div class="text-center">
                <div class="relative mx-auto h-36 w-36 sm:h-44 sm:w-44">
                  <span class="absolute -inset-2 animate-ring rounded-full border border-violet/30 max-md:animate-none" aria-hidden="true" />
                  <div class="h-full w-full overflow-hidden rounded-full ring-4 ring-white">
                    <img
                      v-if="f.photo_url"
                      :src="f.photo_url"
                      :alt="`Portrait of ${f.name}`"
                      loading="lazy"
                      class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-4xl font-semibold text-plum transition-transform duration-500 group-hover:scale-105"
                      aria-hidden="true"
                    >
                      {{ initials(f.name) }}
                    </div>
                  </div>
                </div>

                <p class="mt-6 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">
                  {{ departmentLabel(f.department) }}
                </p>
                <h3 class="mt-1 font-serif text-2xl font-semibold text-navy sm:text-[1.7rem]">{{ f.name }}</h3>
                <p class="mt-1 text-sm text-navy/60">{{ f.role }}</p>
                <p v-if="f.qualifications" class="mt-2 text-[0.85rem] font-medium text-plum">{{ f.qualifications }}</p>
                <p v-if="f.experience_years" class="mt-1 text-[0.8rem] text-navy/60">{{ f.experience_years }}+ years of experience</p>
              </div>

              <div v-if="f.institutions.length" class="mt-6">
                <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Institutions</p>
                <ul class="mt-2 space-y-1 text-[0.9rem] text-navy/75">
                  <li v-for="inst in f.institutions" :key="inst" class="flex gap-2">
                    <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                    {{ inst }}
                  </li>
                </ul>
              </div>

              <div v-if="f.specializations.length" class="mt-5">
                <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Specializations</p>
                <ul class="mt-2 flex flex-wrap gap-2">
                  <li v-for="s in f.specializations" :key="s" class="rounded-full bg-white px-3 py-1 text-[0.78rem] text-plum shadow-[0_2px_10px_rgba(63,46,128,0.08)]">
                    {{ s }}
                  </li>
                </ul>
              </div>

              <p v-if="f.bio" class="mt-6 text-[0.95rem] leading-relaxed text-navy/70">{{ f.bio }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 3. TEAM ============ -->
    <section ref="teamEl" class="bg-lavender-soft px-6 py-16 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <div class="mx-auto max-w-[640px] text-center" :class="[base, teamShown ? on : off]">
          <h2 class="font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
            Our team
          </h2>
        </div>

        <p v-if="membersError" class="mt-12 text-center text-navy/60">
          Our team details will be available here shortly.
          <span v-if="errorHint" class="mt-2 block text-xs text-red-500">[dev] {{ errorHint }}</span>
        </p>

        <!-- Mobile: horizontal swipe slider | sm+: grid -->
        <div
          class="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-8 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:grid-cols-3"
        >
          <div
            v-for="(m, i) in team"
            :key="m.id"
            class="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink"
            :class="[base, teamShown ? on : off]"
            :style="{ transitionDelay: `${150 + i * 140}ms` }"
          >
            <article class="group flex h-full flex-col rounded-[1.75rem] bg-white p-7 text-center shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)]">
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
                {{ departmentLabel(m.department) }}
              </p>
              <h3 class="mt-1 font-serif text-xl font-semibold text-navy">{{ m.name }}</h3>
              <p class="mt-1 text-sm text-navy/60">{{ m.role }}</p>
              <p v-if="m.qualifications" class="mt-1 text-[0.8rem] font-medium text-plum">{{ m.qualifications }}</p>

              <ul v-if="m.specializations.length" class="mt-4 flex flex-wrap justify-center gap-1.5">
                <li
                  v-for="s in m.specializations.slice(0, 3)"
                  :key="s"
                  class="rounded-full bg-lavender-soft px-2.5 py-1 text-[0.7rem] text-plum"
                >
                  {{ s }}
                </li>
                <li v-if="m.specializations.length > 3" class="px-1 py-1 text-[0.7rem] text-navy/50">
                  +{{ m.specializations.length - 3 }} more
                </li>
              </ul>

              <button
                type="button"
                class="mt-auto pt-5 text-sm font-medium text-plum underline-offset-4 transition-colors hover:text-violet hover:underline"
                @click="selected = m"
              >
                View full profile
              </button>
            </article>
          </div>
        </div>

        <!-- Swipe hint (mobile only) -->
        <p v-if="team.length > 1" class="mt-1 flex items-center justify-center gap-1.5 text-xs text-plum/60 sm:hidden">
          Swipe to meet the team
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </p>
      </div>
    </section>

    <!-- ============ 4. CTA ============ -->
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
            Let's build a healthier, happier you, together.
          </h2>
          <NuxtLink
            to="/book"
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

    <!-- ============ PROFILE DIALOG ============ -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selected"
        class="fixed inset-0 z-[60] flex items-end justify-center bg-navy/40 p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        :aria-label="`Profile of ${selected.name}`"
        @click.self="selected = null"
      >
        <div class="relative max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_rgba(63,46,128,0.35)] sm:p-10">
          <button
            type="button"
            class="absolute right-4 top-4 rounded-full p-2 text-navy/60 transition-colors hover:bg-lavender-soft hover:text-navy"
            aria-label="Close profile"
            @click="selected = null"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <div class="text-center">
            <div class="mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-lavender-soft">
              <img
                v-if="selected.photo_url"
                :src="selected.photo_url"
                :alt="`Portrait of ${selected.name}`"
                class="h-full w-full object-cover object-top"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-3xl font-semibold text-plum"
                aria-hidden="true"
              >
                {{ initials(selected.name) }}
              </div>
            </div>
            <p class="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">
              {{ departmentLabel(selected.department) }}
            </p>
            <h3 class="mt-1 font-serif text-2xl font-semibold text-navy">{{ selected.name }}</h3>
            <p class="mt-1 text-sm text-navy/60">{{ selected.role }}</p>
            <p v-if="selected.qualifications" class="mt-2 text-[0.85rem] font-medium text-plum">{{ selected.qualifications }}</p>
            <p v-if="selected.experience_years" class="mt-1 text-[0.8rem] text-navy/60">{{ selected.experience_years }}+ years of experience</p>
          </div>

          <div v-if="selected.institutions.length" class="mt-7">
            <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Institutions</p>
            <ul class="mt-2 space-y-1 text-[0.92rem] text-navy/75">
              <li v-for="inst in selected.institutions" :key="inst" class="flex gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                {{ inst }}
              </li>
            </ul>
          </div>

          <div v-if="selected.specializations.length" class="mt-6">
            <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Specializations</p>
            <ul class="mt-2 flex flex-wrap gap-2">
              <li v-for="s in selected.specializations" :key="s" class="rounded-full bg-lavender-soft px-3 py-1 text-[0.8rem] text-plum">
                {{ s }}
              </li>
            </ul>
          </div>

          <p v-if="selected.bio" class="mt-6 text-[0.95rem] leading-relaxed text-navy/70">{{ selected.bio }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>