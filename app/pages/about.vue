<script setup lang="ts">
import type { Member } from '~/utils/members'
import { departmentLabel, initials } from '~/utils/members'

useSeoMeta({
  title: 'About Us | Soul Solutions',
  description:
    'Meet the founders, mentors and professionals behind Soul Solutions, and read the story of why we bring psychiatrists and clinical psychologists together.',
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
const { el: storyEl, shown: storyShown } = useReveal(0.12)

const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'
const word = 'mr-[0.26em] inline-block transition-all duration-[900ms] ease-out'

/* ---------- Hero ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
const line1 = ['The', 'people', 'behind']
const line2 = ['Soul', 'Solutions.']

/* ---------- People (Notion) ---------- */
const { data: members, error: membersError } = await useFetch<Member[]>('/api/about-team', {
  default: () => [],
})

// Development only: shows the real reason when the API fails
const errorHint = computed(() =>
  import.meta.dev ? (membersError.value as any)?.statusMessage || (membersError.value as any)?.message || '' : '',
)

const byType = (type: Member['type']) => (members.value ?? []).filter((m) => m.type === type)
const founders = computed(() => byType('founder'))
const mentors = computed(() => byType('mentor'))
const professionals = computed(() => byType('professional'))

// The final "The people who care for you" section lists everyone: founders first, then mentors, then professionals
const everyone = computed(() => [...founders.value, ...mentors.value, ...professionals.value])

// Pictures that failed to load fall back to the initials circle
const failedPhotos = ref(new Set<string>())

/* ---------- Profile dialog ----------
   What the dialog shows depends on where the profile was opened:
   - Founders section  -> "Know more": photo, name, role and the Bio column only
   - Mentors section   -> full profile, Bio column at the bottom
   - "The people who care for you" -> full profile, KnowMore column at the bottom (no bio) */
type ProfileSource = 'founders' | 'mentors' | 'team'
const selected = ref<Member | null>(null)
const profileSource = ref<ProfileSource>('founders')

const openProfile = (m: Member, source: ProfileSource) => {
  profileSource.value = source
  selected.value = m
}

const isFounderView = computed(
  () => profileSource.value === 'founders' || profileSource.value === 'mentors',
)

const aboutText = computed(() => {
  const m = selected.value
  if (!m) return ''
  return profileSource.value === 'team' ? m.know_more : (m.bio ?? '')
})

// In the team section the subtitle is the designation; elsewhere it is the role
const subtitle = computed(() => {
  const m = selected.value
  if (!m) return ''
  return profileSource.value === 'team' ? m.designation || m.role : m.role
})

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
          <span class="sr-only">The people behind Soul Solutions</span>
          <span aria-hidden="true">
            <span
              v-for="(w, i) in line1"
              :key="'a' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${250 + i * 120}ms` }"
            >{{ w }}</span>
          </span>
          <br />
          <span aria-hidden="true">
            <span
              v-for="(w, i) in line2"
              :key="'b' + i"
              :class="[word, heroShown ? on : off]"
              :style="{ transitionDelay: `${700 + i * 130}ms` }"
            ><span class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-semibold text-transparent">{{ w }}</span></span>
          </span>
        </h1>

        <p
          class="mx-auto mt-7 max-w-[600px] text-[1.02rem] leading-relaxed text-navy/75"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1300ms"
        >
          Meet the founders and the specialists who listen, understand and create a holistic plan individualised, just for you.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center justify-center gap-4"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1550ms"
        >
          <a
            href="#founders"
            class="rounded-full border-[1.5px] border-plum/70 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:scale-[1.03] hover:border-violet hover:bg-white/60"
          >
            Meet The Whole Team
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

        <div
          class="mt-10 grid gap-3 sm:mt-14 sm:gap-6 lg:gap-8"
          :class="
            founders.length === 1
              ? 'mx-auto max-w-[540px]'
              : founders.length > 2
                ? 'grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-2'
          "
        >
          <div
            v-for="(f, i) in founders"
            :key="f.id"
            :class="[base, foundersShown ? on : off]"
            :style="{ transitionDelay: `${200 + i * 180}ms` }"
          >
            <!-- Card: photo, name and role only -->
            <article class="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-lavender-soft via-white to-[#fff6ee] p-4 shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)] sm:rounded-[2rem] sm:p-8 lg:p-10">
              <div class="text-center">
                <div class="relative mx-auto h-24 w-24 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                  <span class="absolute -inset-2 animate-ring rounded-full border border-violet/30 max-md:animate-none" aria-hidden="true" />
                  <div class="h-full w-full overflow-hidden rounded-full ring-4 ring-white">
                    <img
                      v-if="f.photo_url && !failedPhotos.has(f.id)"
                      :src="f.photo_url"
                      :alt="`Portrait of ${f.name}`"
                      loading="lazy"
                      class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      @error="failedPhotos.add(f.id)"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-2xl font-semibold text-plum transition-transform duration-500 group-hover:scale-105 sm:text-4xl"
                      aria-hidden="true"
                    >
                      {{ initials(f.name) }}
                    </div>
                  </div>
                </div>

                <h3 class="mt-4 font-serif text-base font-semibold leading-snug text-navy sm:mt-6 sm:text-2xl lg:text-[1.7rem]">
                  {{ f.name }}
                </h3>
                <p v-if="f.role" class="mt-1 text-[0.72rem] leading-snug text-navy/60 sm:mt-1.5 sm:text-sm">{{ f.role }}</p>
              </div>

              <button
                type="button"
                class="mt-auto inline-flex items-center justify-center gap-1.5 pt-4 text-center text-[0.75rem] font-medium text-plum underline-offset-4 transition-colors hover:text-violet hover:underline sm:pt-7 sm:text-sm"
                @click="openProfile(f, 'founders')"
              >
                Know more
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 3. MENTORS ============ -->
    <AboutMemberSection
  v-if="mentors.length"
  title="Our mentors"
  :members="mentors"
  tone="white"
  variant="know"
  @select="openProfile($event, 'mentors')"
/>
    <!-- ============ 4. OUR STORY ============ -->
    <section ref="storyEl" class="relative overflow-hidden bg-cream px-6 py-20 lg:px-10 lg:py-28">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -left-24 top-10 h-64 w-64 animate-blob-a rounded-full bg-lavender/60 blur-3xl max-md:animate-none" />
        <div class="absolute -right-24 bottom-0 h-72 w-72 animate-blob-b rounded-full bg-peach/50 blur-3xl max-md:animate-none" />
        <span class="absolute left-[14%] top-[22%] h-2 w-2 animate-twinkle rounded-full bg-violet/40" />
        <span class="absolute right-[18%] top-[30%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#e89a7a]/60 [animation-delay:2s]" />
      </div>

      <div class="relative mx-auto max-w-[820px] text-center">
        <div :class="[base, storyShown ? on : off]">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our story</p>
          <h2 class="mt-4 font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.1] text-navy">
            Every healing journey begins with someone who
            <em class="font-medium italic text-plum">listens.</em>
          </h2>
        </div>

        <div class="mt-9 space-y-5 text-[1.02rem] leading-relaxed text-navy/75">
          <p :class="[base, storyShown ? on : off]" style="transition-delay: 250ms">
            Soul Solutions began with a quiet belief: no one should have to carry their struggles
            alone, and being truly understood is the first step towards healing.
          </p>
          <p :class="[base, storyShown ? on : off]" style="transition-delay: 450ms">
            Too often, care is scattered, with each part of a person's story seen in isolation. So we
            chose to do it differently. Psychiatrists and clinical psychologists sit together,
            listen together and plan together, so that you are cared for as a whole person, not
            as a diagnosis.
          </p>
          <p :class="[base, storyShown ? on : off]" style="transition-delay: 650ms">
            Some days, growth can feel like climbing a mountain. But change rarely arrives in one
            great leap. It comes in small, brave steps: one honest conversation, one deep breath,
            one more day of trying. We walk those steps beside you.
          </p>
        </div>

        <blockquote
          class="relative mx-auto mt-12 max-w-[640px] rounded-[2rem] bg-white px-8 py-10 shadow-[0_20px_60px_rgba(63,46,128,0.1)] sm:px-12"
          :class="[base, storyShown ? on : off]"
          style="transition-delay: 850ms"
        >
          <svg viewBox="0 0 24 24" class="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-lavender p-2.5 text-plum" fill="currentColor" aria-hidden="true">
            <path d="M7.2 6C4.9 7 3.5 9 3.5 11.8V18h6.2v-6.2H6.6c.1-1.5.8-2.5 2-3.2L7.2 6Zm9.3 0c-2.3 1-3.7 3-3.7 5.8V18H19v-6.2h-3.1c.1-1.5.8-2.5 2-3.2L16.5 6Z" />
          </svg>
          <p class="font-serif text-[1.35rem] italic leading-snug text-navy/90 sm:text-[1.6rem]">
            "The curious paradox is that when I accept myself just as I am, then I can change."
          </p>
          <p class="mt-5 font-script text-2xl text-plum">~ Carl Rogers</p>
        </blockquote>

        <p
          class="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70"
          :class="[base, storyShown ? on : off]"
          style="transition-delay: 1050ms"
        >
          <span>Heal</span>
          <span class="h-1 w-1 rounded-full bg-violet/60" aria-hidden="true" />
          <span>Understand</span>
          <span class="h-1 w-1 rounded-full bg-violet/60" aria-hidden="true" />
          <span>Grow</span>
        </p>
      </div>
    </section>

    <!-- ============ 5. THE PEOPLE WHO CARE FOR YOU: name + designation, profile shows KnowMore ============ -->
    <AboutMemberSection
      v-if="everyone.length"
      title="The people who care for you"
      :members="everyone"
      tone="lavender"
      variant="team"
      @select="openProfile($event, 'team')"
    />

    <!-- ============ 6. CTA ============ -->
    <CtaBanner
      tone="cream"
      title="'When we are no longer able to change a situation, we are challenged to change ourselves.'"
      text=" ~ Viktor Frankl"
      button="Book a Joint Consultation"
    />

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
                v-if="selected.photo_url && !failedPhotos.has(selected.id)"
                :src="selected.photo_url"
                :alt="`Portrait of ${selected.name}`"
                class="h-full w-full object-cover object-top"
                @error="failedPhotos.add(selected.id)"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-3xl font-semibold text-plum"
                aria-hidden="true"
              >
                {{ initials(selected.name) }}
              </div>
            </div>

            <!-- Department label: not shown for founders -->
            <p
              v-if="!isFounderView && departmentLabel(selected.department)"
              class="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60"
            >
              {{ departmentLabel(selected.department) }}
            </p>

            <!-- Founders: name only. Others: degree in brackets after the name -->
            <h3 class="font-serif text-2xl font-semibold text-navy" :class="isFounderView ? 'mt-5' : 'mt-1'">
              {{ selected.name }}
            </h3>

            <p
                v-if="!isFounderView && selected.qualifications"
                class="mt-1 text-[0.95rem] font-medium text-plum"
              >
                {{ selected.qualifications }}
            </p>


            <p v-if="subtitle" class="mt-1 text-sm text-navy/60">{{ subtitle }}</p>
            <p v-if="!isFounderView && selected.experience_years" class="mt-1 text-[0.8rem] text-navy/60">
              {{ selected.experience_years }}+ years of experience
            </p>
          </div>

          <!-- Specializations and institutions: not shown for founders -->
          <div v-if="!isFounderView && selected.specializations.length" class="mt-7">
            <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Specializations</p>
            <ul class="mt-2 flex flex-wrap gap-2">
              <li v-for="s in selected.specializations" :key="s" class="max-w-full break-words rounded-2xl bg-lavender-soft px-3.5 py-2 text-[0.85rem] leading-snug text-plum">
                {{ s }}
              </li>
            </ul>
          </div>

          <div v-if="!isFounderView && selected.institutions.length" class="mt-6">
            <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">Institutions</p>
            <ul class="mt-2 space-y-1 text-[0.92rem] text-navy/75">
              <li v-for="inst in selected.institutions" :key="inst" class="flex gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                {{ inst }}
              </li>
            </ul>
          </div>

          <!-- Founders / Mentors: Bio column. "The people who care for you": KnowMore column -->
          <p v-if="aboutText" class="mt-6 whitespace-pre-line text-[0.95rem] leading-relaxed text-navy/70">{{ aboutText }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>