<script setup lang="ts">
useSeoMeta({
  title: 'Testimonials | Soul Solutions',
  description: 'Read what our clients say, and share your own experience with Soul Solutions.',
})

interface Testimonial {
  id: string
  name: string
  quote: string
  context: string
  rating: number | null
  featured: boolean
}

const { data, error } = await useFetch<Testimonial[]>('/api/testimonials', { default: () => [] })

// All active reviews, newest first (order comes from the API).
const testimonials = computed(() => data.value ?? [])

/* ---------- Hero ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))

/* ---------- Featured slider ---------- */
const featured = computed(() => {
  const f = testimonials.value.filter((t) => t.featured)
  return f.length ? f : testimonials.value.slice(0, 3)
})

const active = ref(0)
const hovering = ref(false)
const current = computed(() => featured.value[active.value] ?? null)

const go = (i: number) => {
  const n = featured.value.length
  if (!n) return
  active.value = ((i % n) + n) % n
}

useIntervalFn(() => {
  if (!hovering.value && featured.value.length > 1) go(active.value + 1)
}, 6000)

/* ---------- Swipe carousel (all reviews) ---------- */
const track = ref<HTMLElement | null>(null)
const canPrev = ref(false)
const canNext = ref(false)
const position = ref(1)
const dragging = ref(false)

const GAP = 24

const cardStep = () => {
  const card = track.value?.querySelector<HTMLElement>('[data-card]')
  return card ? card.offsetWidth + GAP : 320
}

const updateState = () => {
  const el = track.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
  position.value = Math.min(testimonials.value.length, Math.round(el.scrollLeft / cardStep()) + 1)
}

const scrollByCard = (dir: 1 | -1) => {
  track.value?.scrollBy({ left: dir * cardStep(), behavior: 'smooth' })
}

onMounted(() => nextTick(updateState))
watch(testimonials, () => nextTick(updateState))
useEventListener('resize', updateState)

// Touch screens swipe natively. This adds click-and-drag for mouse users.
let isDown = false
let startX = 0
let startScroll = 0

const onPointerDown = (e: PointerEvent) => {
  if (e.pointerType === 'touch' || !track.value) return
  isDown = true
  startX = e.clientX
  startScroll = track.value.scrollLeft
}
const onPointerMove = (e: PointerEvent) => {
  if (!isDown || !track.value) return
  const dx = e.clientX - startX
  if (Math.abs(dx) > 5) dragging.value = true
  track.value.scrollLeft = startScroll - dx
}
const endDrag = () => {
  isDown = false
  dragging.value = false
}

/* ---------- Review form ---------- */
const form = reactive({
  name: '',
  context: '',
  rating: 0,
  quote: '',
  consent: false,
  website: '', // honeypot
})
const hoverRating = ref(0)
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const MAX = 800
const canSubmit = computed(() => form.quote.trim().length >= 20 && form.consent && !submitting.value)

const submitReview = async () => {
  submitError.value = ''
  submitting.value = true
  try {
    await $fetch('/api/testimonials', {
      method: 'POST',
      body: {
        name: form.name,
        context: form.context,
        rating: form.rating || undefined,
        quote: form.quote,
        consent: form.consent,
        website: form.website,
      },
    })
    submitted.value = true
  } catch (err: any) {
    submitError.value =
      err?.data?.statusMessage || 'Something went wrong. Please try again in a little while.'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.context = ''
  form.rating = 0
  form.quote = ''
  form.consent = false
  submitted.value = false
}

const field =
  'mt-2 w-full rounded-2xl border border-plum/15 bg-white/80 px-5 py-3.5 text-[0.95rem] text-navy placeholder:text-navy/35 transition-all duration-300 focus:border-violet focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet/15'

const initials = (name: string) =>
  name
    .replace(/^(Dr|Ms|Mr|Mrs)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'S'
</script>

<template>
  <main>
    <!-- ============ HERO ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#f2ede1] via-cream to-[#edf5f0] px-6 pb-12 pt-32 sm:pt-40 lg:px-10 lg:pb-14">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-10 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
        <span class="absolute left-[14%] top-[32%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
        <span class="absolute right-[18%] top-[26%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#c9b88c]/70 [animation-delay:2s]" />
      </div>

      <div class="mx-auto max-w-[720px] text-center">
        <p
          class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70 transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          Testimonials
        </p>
        <h1
          class="mt-5 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.1] text-navy transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[8px]'"
          style="transition-delay: 200ms"
        >
          Stories of people who
          <em class="animate-shimmer bg-[linear-gradient(90deg,#1e4d46,#7da88e,#c9b88c,#7da88e,#1e4d46)] bg-[length:200%_auto] bg-clip-text font-medium italic text-transparent">
            took the first step.
          </em>
        </h1>
        <p
          class="mx-auto mt-5 max-w-[500px] text-[1.02rem] leading-relaxed text-navy/75 transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          style="transition-delay: 500ms"
        >
          Read what our clients say, and share your own experience.
        </p>
      </div>
    </section>

    <!-- ============ WHAT OUR CLIENTS SAY ============ -->
    <section class="bg-cream pb-16 lg:pb-20">
      <div class="mx-auto max-w-[1240px]">
        <div class="px-6 text-center lg:px-10">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">In their words</p>
          <h2 class="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl">What our clients say</h2>
        </div>

        <p v-if="error" class="mt-12 px-6 text-center text-navy/60">
          Reviews will be available here shortly.
        </p>

        <div v-else-if="testimonials.length === 0" class="mt-12 px-6 text-center">
          <p class="text-navy/60">No reviews yet. Be the first to share your experience.</p>
          <a
            href="#share"
            class="mt-5 inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Share your experience
          </a>
        </div>

        <template v-else>
          <!-- ===== Featured slider ===== -->
          <div
            class="relative mx-auto mt-10 max-w-[900px] px-6 lg:px-0"
            @mouseenter="hovering = true"
            @mouseleave="hovering = false"
          >
            <div class="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-lavender via-peach/60 to-mint/60 blur-2xl" aria-hidden="true" />

            <div class="relative overflow-hidden rounded-[2rem] bg-white px-7 pb-10 pt-12 text-center shadow-[0_30px_80px_rgba(30,77,70,0.14)] sm:px-14 sm:pb-12 sm:pt-14">
              <span class="pointer-events-none absolute left-6 top-2 select-none font-serif text-[7rem] leading-none text-violet/20 sm:left-10 sm:text-[9rem]" aria-hidden="true">&ldquo;</span>

              <Transition
                mode="out-in"
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="opacity-0 translate-y-3 blur-sm"
                leave-active-class="transition duration-300 ease-in"
                leave-to-class="opacity-0 -translate-y-3"
              >
                <figure v-if="current" :key="current.id" class="relative min-h-[190px]">
                  <div v-if="current.rating" class="mb-4 flex justify-center gap-1" :aria-label="`${current.rating} out of 5 stars`">
                    <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="h-5 w-5" :class="n <= current.rating ? 'text-gold' : 'text-plum/15'" fill="currentColor" aria-hidden="true">
                      <path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9L12 2.8Z" />
                    </svg>
                  </div>
                  <blockquote class="font-serif text-[1.25rem] italic leading-relaxed text-navy sm:text-[1.65rem]">
                    {{ current.quote }}
                  </blockquote>
                  <figcaption class="mt-7 flex flex-col items-center gap-2">
                    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-lavender font-serif text-sm font-semibold text-plum">
                      {{ initials(current.name) }}
                    </span>
                    <span class="font-medium text-navy">{{ current.name }}</span>
                    <span v-if="current.context" class="text-xs uppercase tracking-[0.2em] text-plum/60">{{ current.context }}</span>
                  </figcaption>
                </figure>
              </Transition>

              <div v-if="featured.length > 1" class="relative mt-8 flex items-center justify-center gap-5">
                <button
                  type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-plum/20 text-plum transition-all duration-300 hover:border-plum hover:bg-lavender-soft"
                  aria-label="Previous featured review"
                  @click="go(active - 1)"
                >
                  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
                </button>

                <div class="flex items-center gap-2">
                  <button
                    v-for="(t, i) in featured"
                    :key="t.id"
                    type="button"
                    class="h-2 rounded-full transition-all duration-500"
                    :class="active === i ? 'w-7 bg-plum' : 'w-2 bg-plum/25 hover:bg-plum/50'"
                    :aria-label="`Show featured review ${i + 1}`"
                    :aria-current="active === i"
                    @click="go(i)"
                  />
                </div>

                <button
                  type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-plum/20 text-plum transition-all duration-300 hover:border-plum hover:bg-lavender-soft"
                  aria-label="Next featured review"
                  @click="go(active + 1)"
                >
                  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- ===== All reviews (swipe carousel) ===== -->
          <div class="mt-16 px-6 text-center lg:px-10">
            <h3 class="font-serif text-2xl font-semibold text-navy">All reviews</h3>
          </div>

          <div class="relative mt-6">
            <!-- Edge fades hint that there is more to swipe -->
            <div
              class="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-cream to-transparent transition-opacity duration-300 sm:w-12"
              :class="canPrev ? 'opacity-100' : 'opacity-0'"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-cream to-transparent transition-opacity duration-300 sm:w-12"
              :class="canNext ? 'opacity-100' : 'opacity-0'"
              aria-hidden="true"
            />

            <ul
              ref="track"
              class="flex gap-6 overflow-x-auto px-6 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-10"
              :class="dragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory'"
              aria-label="All client reviews, swipe to see more"
              @scroll.passive="updateState"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="endDrag"
              @pointerleave="endDrag"
              @pointercancel="endDrag"
            >
              <li
                v-for="t in testimonials"
                :key="t.id"
                data-card
                class="group flex w-[84%] shrink-0 snap-start flex-col rounded-[1.75rem] bg-white p-7 shadow-[0_10px_40px_rgba(30,77,70,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_56px_rgba(125,168,142,0.28)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div v-if="t.rating" class="flex gap-0.5" :aria-label="`${t.rating} out of 5 stars`">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="h-4 w-4" :class="n <= t.rating ? 'text-gold' : 'text-plum/15'" fill="currentColor" aria-hidden="true">
                    <path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9L12 2.8Z" />
                  </svg>
                </div>
                <span v-else class="block h-8 select-none font-serif text-5xl leading-none text-violet/40" aria-hidden="true">&ldquo;</span>

                <p class="mt-3 flex-1 leading-relaxed text-navy/80">{{ t.quote }}</p>

                <div class="mt-6 flex items-center gap-3 border-t border-plum/10 pt-5">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender font-serif text-xs font-semibold text-plum">
                    {{ initials(t.name) }}
                  </span>
                  <span>
                    <span class="block text-sm font-medium text-navy">{{ t.name }}</span>
                    <span v-if="t.context" class="block text-xs text-navy/55">{{ t.context }}</span>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-center gap-5 px-6">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-plum/20 text-plum transition-all duration-300 hover:border-plum hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-plum/20 disabled:hover:bg-transparent"
              :disabled="!canPrev"
              aria-label="Previous review"
              @click="scrollByCard(-1)"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            </button>

            <p class="min-w-[64px] text-center text-sm tabular-nums text-navy/60">
              {{ position }} / {{ testimonials.length }}
            </p>

            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-plum/20 text-plum transition-all duration-300 hover:border-plum hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-plum/20 disabled:hover:bg-transparent"
              :disabled="!canNext"
              aria-label="Next review"
              @click="scrollByCard(1)"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>

          <p class="mt-3 text-center text-xs text-navy/45 sm:hidden">Swipe to read more</p>

          <div class="mt-8 text-center">
            <a
              href="#share"
              class="inline-flex items-center gap-2 text-sm font-medium text-plum underline-offset-4 hover:underline"
            >
              Been to Soul Solutions? Share your experience
            </a>
          </div>
        </template>
      </div>
    </section>

    <!-- ============ SHARE YOUR EXPERIENCE ============ -->
    <section id="share" class="scroll-mt-24 bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div class="mx-auto max-w-[760px]">
        <div class="relative overflow-hidden rounded-[2rem] bg-cream p-7 shadow-[0_20px_70px_rgba(30,77,70,0.1)] sm:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-blob-a rounded-full bg-violet/10 blur-3xl max-md:animate-none" aria-hidden="true" />

          <!-- Thank-you state -->
          <div v-if="submitted" class="relative py-8 text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint text-plum">
              <svg viewBox="0 0 24 24" class="h-9 w-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </div>
            <h2 class="mt-6 font-serif text-3xl font-semibold text-navy">Thank you for sharing.</h2>
            <p class="mx-auto mt-3 max-w-[440px] text-navy/70">
              Your words have reached us. After a quick review by our team, they will appear on this page.
            </p>
            <button
              type="button"
              class="mt-8 inline-flex items-center gap-2 rounded-full border-[1.5px] border-plum/70 px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:bg-white"
              @click="resetForm"
            >
              Write another
            </button>
          </div>

          <!-- Form -->
          <form v-else class="relative space-y-6" @submit.prevent="submitReview">
            <div>
              <h2 class="font-serif text-2xl font-semibold text-navy sm:text-3xl">Share your experience</h2>
              <p class="mt-1 text-sm text-navy/60">It only takes a minute. Share only what you are comfortable with.</p>
            </div>

            <!-- Star rating -->
            <div>
              <p class="text-sm font-medium text-navy/80">How was your experience? <span class="text-navy/40">(optional)</span></p>
              <div class="mt-2 flex gap-1" role="radiogroup" aria-label="Rating" @mouseleave="hoverRating = 0">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  class="rounded p-1 transition-transform duration-200 hover:scale-110"
                  :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                  :aria-checked="form.rating === n"
                  role="radio"
                  @mouseenter="hoverRating = n"
                  @click="form.rating = form.rating === n ? 0 : n"
                >
                  <svg viewBox="0 0 24 24" class="h-8 w-8 transition-colors duration-200" :class="n <= (hoverRating || form.rating) ? 'text-gold' : 'text-plum/15'" fill="currentColor" aria-hidden="true">
                    <path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9L12 2.8Z" />
                  </svg>
                </button>
              </div>
            </div>

            <label class="block text-sm font-medium text-navy/80">
              Your experience
              <textarea
                v-model="form.quote"
                rows="5"
                :maxlength="MAX"
                required
                placeholder="What would you like others to know about your time with us?"
                :class="field"
              />
              <span class="mt-1 block text-right text-xs" :class="form.quote.trim().length < 20 ? 'text-navy/40' : 'text-plum/70'">
                {{ form.quote.length }} / {{ MAX }} (at least 20 characters)
              </span>
            </label>

            <div class="grid gap-5 sm:grid-cols-2">
              <label class="block text-sm font-medium text-navy/80">
                Name <span class="text-navy/40">(optional)</span>
                <input v-model="form.name" type="text" maxlength="60" placeholder="First name or initials is fine" :class="field" />
              </label>
              <label class="block text-sm font-medium text-navy/80">
                About you <span class="text-navy/40">(optional)</span>
                <input v-model="form.context" type="text" maxlength="80" placeholder="e.g. Counselling client" :class="field" />
              </label>
            </div>

            <!-- Honeypot: hidden from people, bots fill it -->
            <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>Website <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
            </div>

            <label class="flex cursor-pointer items-start gap-3 text-sm text-navy/70">
              <input v-model="form.consent" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-[#1E4D46]" />
              <span>I am happy for Soul Solutions to display my words on this website. I have not included anyone else's personal details.</span>
            </label>

            <p v-if="submitError" class="rounded-xl bg-blush/40 px-4 py-3 text-sm text-navy" role="alert">{{ submitError }}</p>

            <div class="flex flex-col items-end gap-2">
              <button
                type="submit"
                :disabled="!canSubmit"
                class="inline-flex items-center gap-2 rounded-full bg-plum px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {{ submitting ? 'Sending…' : 'Submit my experience' }}
                <svg v-if="!submitting" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <p class="text-xs text-navy/45">Reviews are checked by our team before they appear.</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="bg-white px-6 pb-24 lg:px-10">
      <div class="relative mx-auto max-w-[1000px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#15352f] via-plum to-[#3d6b5c] px-8 py-14 text-center shadow-[0_30px_80px_rgba(30,77,70,0.3)] sm:px-16">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <span class="absolute left-[10%] top-[20%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
          <span class="absolute right-[14%] top-[26%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2s]" />
        </div>
        <h2 class="relative font-serif text-2xl font-semibold text-white sm:text-3xl">
          Your story can start here.
        </h2>
        <p class="relative mx-auto mt-3 max-w-[440px] text-white/80">
          Book a session and take the first step, at your own pace.
        </p>
        <NuxtLink
          to="/book"
          class="group relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
        >
          Book a Session
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>