<script setup lang="ts">
useSeoMeta({ title: 'Gallery | Soul Solutions', description: 'A look inside our calm, welcoming spaces and events.' })

interface GalleryItem {
  id: string
  src: string | null
  caption: string
}

const { data: items, error } = await useFetch<GalleryItem[]>('/api/gallery', { default: () => [] })

/* Lightbox */
const current = ref<number | null>(null)
const open = (i: number) => (current.value = i)
const close = () => (current.value = null)
const step = (d: number) => {
  if (current.value === null) return
  current.value = (current.value + d + items.value.length) % items.value.length
}

const currentItem = computed(() =>
  current.value === null ? null : (items.value[current.value] ?? null),
)

onKeyStroke('Escape', close)
onKeyStroke('ArrowLeft', () => step(-1))
onKeyStroke('ArrowRight', () => step(1))

const locked = useScrollLock(typeof document !== 'undefined' ? document.body : null)
watch(current, (v) => (locked.value = v !== null))
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
        <p v-if="error" class="text-center text-navy/60">
          Our gallery will be available here shortly.
        </p>

        <p v-else-if="items.length === 0" class="text-center text-navy/60">
          Photos are coming soon.
        </p>

        <TransitionGroup
          v-else
          tag="div"
          class="columns-1 gap-5 sm:columns-2 lg:columns-3"
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="hidden"
        >
          <button
            v-for="(img, i) in items"
            :key="img.id"
            type="button"
            class="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.75rem] shadow-[0_10px_40px_rgba(63,46,128,0.1)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(124,92,196,0.25)]"
            :aria-label="`Open photo${img.caption ? ': ' + img.caption : ''}`"
            @click="open(i)"
          >
            <img
              :src="img.src!"
              :alt="img.caption || 'Soul Solutions gallery photo'"
              loading="lazy"
              class="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <span class="absolute inset-0 bg-gradient-to-t from-plum/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span
              v-if="img.caption"
              class="absolute bottom-4 left-5 translate-y-2 text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
            >
              {{ img.caption }}
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
        <img :src="currentItem.src!" :alt="currentItem.caption || 'Soul Solutions gallery photo'" class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
        <button type="button" class="absolute right-3 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25 sm:right-8" aria-label="Next photo" @click="step(1)">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
    </Transition>
  </main>
</template>