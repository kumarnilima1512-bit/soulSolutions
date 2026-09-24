<script setup lang="ts">
useSeoMeta({ title: 'Gallery | Soul Solutions', description: 'A look inside our calm, welcoming spaces and events.' })

const items = [
  { src: '/images/hero.png', alt: 'Sunrise hilltop', cat: 'Nature', ratio: 'aspect-[4/5]', pos: '25% center' },
  { src: '/images/hero.png', alt: 'Golden sky', cat: 'Nature', ratio: 'aspect-square', pos: '60% 20%' },
  { src: '/images/hero.png', alt: 'Book and cup', cat: 'Sessions', ratio: 'aspect-[4/3]', pos: '50% 90%' },
  { src: '/images/hero.png', alt: 'Tree in the light', cat: 'Events', ratio: 'aspect-[3/4]', pos: '90% 20%' },
  { src: '/images/hero.png', alt: 'Valley view', cat: 'Nature', ratio: 'aspect-[4/3]', pos: '55% 50%' },
  { src: '/images/hero.png', alt: 'Wildflowers', cat: 'Sessions', ratio: 'aspect-square', pos: '15% 95%' },
]

const cats = ['All', ...new Set(items.map((i) => i.cat))]
const active = ref('All')
const filtered = computed(() => (active.value === 'All' ? items : items.filter((i) => i.cat === active.value)))

/* Lightbox */
const current = ref<number | null>(null)
const open = (i: number) => (current.value = i)
const close = () => (current.value = null)
const step = (d: number) => {
  if (current.value === null) return
  current.value = (current.value + d + filtered.value.length) % filtered.value.length
}

// TypeScript error fix: safe computed, undefined hole null dey
const currentItem = computed(() =>
  current.value === null ? null : (filtered.value[current.value] ?? null),
)

onKeyStroke('Escape', close)
onKeyStroke('ArrowLeft', () => step(-1))
onKeyStroke('ArrowRight', () => step(1))

const locked = useScrollLock(typeof document !== 'undefined' ? document.body : null)
watch(current, (v) => (locked.value = v !== null))
watch(active, close)
</script>

<template>
  <main>
    <PageHeader
      eyebrow="Photo gallery"
      title="A peaceful space,"
      accent="in pictures."
      text="A glimpse of the calm, welcoming places and moments that make Soul Solutions feel like home."
    />

    <section class="bg-cream px-6 pb-20 lg:px-10 lg:pb-28">
      <div class="mx-auto max-w-[1240px]">
        <!-- Filters -->
        <div class="flex flex-wrap justify-center gap-3" role="group" aria-label="Filter photos">
          <button
            v-for="c in cats"
            :key="c"
            type="button"
            class="rounded-full border px-5 py-2 text-sm transition-all duration-300"
            :class="active === c
              ? 'border-plum bg-plum text-white shadow-[0_8px_24px_rgba(124,92,196,0.35)]'
              : 'border-plum/20 bg-white text-navy/75 hover:border-violet hover:text-plum'"
            :aria-pressed="active === c"
            @click="active = c"
          >
            {{ c }}
          </button>
        </div>

        <!-- Grid -->
        <TransitionGroup
          tag="div"
          class="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3"
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="hidden"
        >
          <button
            v-for="(img, i) in filtered"
            :key="img.alt"
            type="button"
            class="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.75rem] shadow-[0_10px_40px_rgba(63,46,128,0.1)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(124,92,196,0.25)]"
            :aria-label="`Open photo: ${img.alt}`"
            @click="open(i)"
          >
            <img
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              class="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              :class="img.ratio"
              :style="{ objectPosition: img.pos }"
            />
            <span class="absolute inset-0 bg-gradient-to-t from-plum/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span class="absolute bottom-4 left-5 translate-y-2 text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {{ img.alt }}
            </span>
          </button>
        </TransitionGroup>
      </div>
    </section>

    <!-- Lightbox -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="currentItem"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-navy/85 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        @click.self="close"
      >
        <button type="button" class="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25" aria-label="Close" @click="close">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <button type="button" class="absolute left-3 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 sm:left-8" aria-label="Previous photo" @click="step(-1)">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <img :src="currentItem.src" :alt="currentItem.alt" class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
        <button type="button" class="absolute right-3 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 sm:right-8" aria-label="Next photo" @click="step(1)">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
    </Transition>
  </main>
</template>