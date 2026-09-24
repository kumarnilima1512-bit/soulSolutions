<script setup lang="ts">
useSeoMeta({ title: 'Videos | Soul Solutions', description: 'Guided calm, stories and mental wellness talks.' })


const videos = [
  { title: 'Welcome to Soul Solutions', text: 'A short introduction to who we are and how we help.', src: '/videos/hero.mp4', poster: '/images/hero.png', tag: 'Introduction' },
  { title: 'A 2-minute breathing pause', text: 'A gentle exercise you can do anywhere, anytime.', src: '/videos/hero.mp4', poster: '/images/hero.png', tag: 'Guided calm' },
  { title: 'What to expect in your first session', text: 'No pressure. Here is how your first conversation feels.', src: '/videos/hero.mp4', poster: '/images/hero.png', tag: 'Getting started' },
] as { title: string; text: string; src?: string; youtube?: string; poster: string; tag: string }[]

const selected = ref(0)
const current = computed(() => videos[selected.value]!)
const player = ref<HTMLElement | null>(null)

const pick = (i: number) => {
  selected.value = i
  player.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <main>
    <PageHeader
      eyebrow="Video library"
      title="Watch, breathe,"
      accent="and feel lighter."
      text="Short guided sessions, stories and talks to support you between appointments."
    />

    <section class="bg-cream px-6 pb-20 lg:px-10 lg:pb-28">
      <div class="mx-auto max-w-[1100px]">
        <!-- Player -->
        <div ref="player" class="relative">
          <div class="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-lavender via-peach/60 to-mint/60 blur-2xl" aria-hidden="true" />
          <div class="relative aspect-video overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_80px_rgba(63,46,128,0.25)]">
            <iframe
              v-if="current.youtube"
              :key="current.youtube"
              class="h-full w-full"
              :src="`https://www.youtube-nocookie.com/embed/${current.youtube}`"
              :title="current.title"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowfullscreen
              loading="lazy"
            />
            <video
              v-else
              :key="current.src"
              class="h-full w-full object-cover"
              :src="current.src"
              :poster="current.poster"
              controls
              playsinline
              preload="metadata"
            />
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">{{ current.tag }}</p>
          <h2 class="mt-2 font-serif text-3xl font-semibold text-navy">{{ current.title }}</h2>
          <p class="mx-auto mt-2 max-w-[520px] text-navy/70">{{ current.text }}</p>
        </div>

        <!-- Playlist -->
        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="(v, i) in videos"
            :key="v.title"
            type="button"
            class="group overflow-hidden rounded-[1.75rem] bg-white text-left shadow-[0_10px_40px_rgba(63,46,128,0.08)] ring-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.22)]"
            :class="selected === i ? 'ring-violet' : 'ring-transparent'"
            :aria-label="`Play: ${v.title}`"
            @click="pick(i)"
          >
            <div class="relative aspect-video overflow-hidden">
              <img :src="v.poster" alt="" loading="lazy" class="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <span class="absolute inset-0 flex items-center justify-center bg-navy/20 transition-colors duration-500 group-hover:bg-navy/35">
                <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-plum shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" class="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                </span>
              </span>
            </div>
            <div class="p-6">
              <p class="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-plum/60">{{ v.tag }}</p>
              <h3 class="mt-1 font-serif text-xl font-semibold text-navy">{{ v.title }}</h3>
              <p class="mt-1 text-sm text-navy/65">{{ v.text }}</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>