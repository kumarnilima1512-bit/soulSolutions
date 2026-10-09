<script setup lang="ts">
useSeoMeta({
  title: 'Activities & Programmes | Soul Solutions',
  description:
    'A glimpse into the activities and programmes at Soul Solutions, where people connect, express themselves and grow together.',
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

const { el: galleryEl, shown: galleryShown } = useReveal(0.05)
const { el: ctaEl, shown: ctaShown } = useReveal(0.3)

const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'
const word = 'mr-[0.26em] inline-block transition-all duration-[900ms] ease-out'

/* ---------- Hero ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
const line1 = ['Moments', 'of', 'healing,']
const line2 = ['growth', 'and', 'togetherness.']

/* ---------- Images (Notion) ---------- */
interface ActivityImage {
  id: string
  title: string
  category: string
  url: string
  order: number
}

const { data: images, error: imagesError } = await useFetch<ActivityImage[]>('/api/activities', {
  default: () => [],
})

// Development only: shows the real reason when the API fails
const errorHint = computed(() =>
  import.meta.dev ? (imagesError.value as any)?.statusMessage || (imagesError.value as any)?.message || '' : '',
)

/* ---------- Category filter ---------- */
const ALL = 'All'
const active = ref(ALL)

const categories = computed(() => [
  ...new Set((images.value ?? []).map((i) => i.category).filter(Boolean)),
])
const tabs = computed(() => (categories.value.length ? [ALL, ...categories.value] : []))

const visibleImages = computed(() =>
  active.value === ALL ? images.value ?? [] : (images.value ?? []).filter((i) => i.category === active.value),
)

/* ---------- Lightbox ---------- */
const current = ref<number | null>(null)
const currentImage = computed(() => (current.value === null ? null : visibleImages.value[current.value] ?? null))

const openAt = (i: number) => (current.value = i)
const close = () => (current.value = null)
const next = () => {
  if (current.value === null || !visibleImages.value.length) return
  current.value = (current.value + 1) % visibleImages.value.length
}
const prev = () => {
  if (current.value === null || !visibleImages.value.length) return
  current.value = (current.value - 1 + visibleImages.value.length) % visibleImages.value.length
}

onKeyStroke('Escape', close)
onKeyStroke('ArrowRight', () => currentImage.value && next())
onKeyStroke('ArrowLeft', () => currentImage.value && prev())

// Swipe left / right on touch screens
const lightboxImg = ref<HTMLElement | null>(null)
useSwipe(lightboxImg, {
  threshold: 50,
  onSwipeEnd(_e, direction) {
    if (direction === 'left') next()
    else if (direction === 'right') prev()
  },
})

watch(active, close)
watch(currentImage, (v) => {
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
          <span aria-current="page" class="font-medium text-plum">Activity</span>
        </nav>

        <h1 class="mt-6 font-serif text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[1.08] text-navy">
          <span class="sr-only">Moments of healing, growth and togetherness.</span>
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
          style="transition-delay: 1400ms"
        >
          A glimpse into the activities and programmes we organise, where people connect, express
          themselves and grow together.
        </p>

        <div
          class="mt-9 flex flex-wrap items-center justify-center gap-4"
          :class="[base, heroShown ? on : off]"
          style="transition-delay: 1650ms"
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
            href="#moments"
            class="rounded-full border-[1.5px] border-plum/70 px-7 py-3.5 text-sm font-medium text-plum transition-all duration-300 hover:scale-[1.03] hover:border-violet hover:bg-white/60"
          >
            See the Moments
          </a>
        </div>
      </div>

      <svg class="absolute -bottom-px left-0 z-10 h-12 w-full sm:h-16 lg:h-20" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path class="fill-white" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
      </svg>
    </section>

    <!-- ============ 2. IMAGE GALLERY ============ -->
    <section id="moments" ref="galleryEl" class="scroll-mt-24 bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div class="mx-auto max-w-[1240px]">
        <!-- Filter tabs (only when the database has categories) -->
        <div
          v-if="tabs.length"
          class="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          role="tablist"
          aria-label="Filter by category"
          :class="[base, galleryShown ? on : off]"
        >
          <button
            v-for="t in tabs"
            :key="t"
            type="button"
            role="tab"
            :aria-selected="active === t"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
            :class="
              active === t
                ? 'bg-plum text-white shadow-[0_8px_24px_rgba(124,92,196,0.35)]'
                : 'bg-lavender-soft text-plum hover:bg-lavender'
            "
            @click="active = t"
          >
            {{ t }}
          </button>
        </div>

        <!-- Error / empty states -->
        <p v-if="imagesError" class="mt-12 text-center text-navy/60">
          Our photos will be available here shortly.
          <span v-if="errorHint" class="mt-2 block text-xs text-red-500">[dev] {{ errorHint }}</span>
        </p>
        <p v-else-if="!visibleImages.length" class="mt-12 text-center text-navy/60">
          Photos from our activities and programmes will appear here soon.
        </p>

        <!-- Masonry grid -->
        <TransitionGroup
          v-else
          tag="div"
          class="mt-8 columns-2 gap-3 sm:mt-12 sm:columns-3 sm:gap-5 xl:columns-4"
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
        >
          <button
            v-for="(img, i) in visibleImages"
            :key="img.id"
            type="button"
            class="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-lavender-soft shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(124,92,196,0.25)] sm:mb-5 sm:rounded-3xl"
            :style="{ transitionDelay: `${Math.min(i, 10) * 70}ms` }"
            :aria-label="img.title ? `Open photo: ${img.title}` : 'Open photo'"
            @click="openAt(i)"
          >
            <img
              :src="img.url"
              :alt="img.title || 'Activity photo'"
              loading="lazy"
              decoding="async"
              class="block h-auto w-full transition-transform duration-700 group-hover:scale-105"
            />
            <span
              v-if="img.title"
              class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent px-4 pb-3 pt-10 text-left text-sm font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              {{ img.title }}
            </span>
          </button>
        </TransitionGroup>
      </div>
    </section>

    <!-- ============ 3. CTA ============ -->
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

    <!-- ============ LIGHTBOX ============ -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="currentImage"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        :aria-label="currentImage.title || 'Photo viewer'"
        @click.self="close"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          aria-label="Close photo viewer"
          @click="close"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <button
          v-if="visibleImages.length > 1"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:left-6"
          aria-label="Previous photo"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>

        <figure class="flex max-h-full max-w-[min(92vw,1100px)] flex-col items-center">
          <img
            ref="lightboxImg"
            :key="currentImage.id"
            :src="currentImage.url"
            :alt="currentImage.title || 'Activity photo'"
            class="max-h-[78vh] w-auto max-w-full select-none rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            draggable="false"
          />
          <figcaption class="mt-4 text-center text-sm text-white/80">
            <span v-if="currentImage.title" class="block font-serif text-lg text-white">{{ currentImage.title }}</span>
            <span class="text-xs tracking-[0.2em] text-white/60">
              {{ (current ?? 0) + 1 }} / {{ visibleImages.length }}
            </span>
          </figcaption>
        </figure>

        <button
          v-if="visibleImages.length > 1"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:right-6"
          aria-label="Next photo"
          @click="next"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>