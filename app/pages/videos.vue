<script setup lang="ts">
useSeoMeta({ title: 'Videos | Soul Solutions', description: 'Guided calm, stories and mental wellness talks.' })

interface VideoItem {
  id: string
  title: string
  description: string
  tag: string
  url: string
  platform: 'youtube' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'direct' | 'unknown'
  embedUrl: string | null
  embedHtml: string | null
  poster: string | null
}

interface VideosResponse {
  ok: boolean
  videos: VideoItem[]
  error?: string
}
const { data: response, error } = await useFetch<VideosResponse>('/api/videos')
const videos = computed(() => response.value?.videos ?? [])
const selected = ref(0)
const current = computed<VideoItem | null>(() => videos.value[selected.value] ?? null)
const player = ref<HTMLElement | null>(null)

const pick = (i: number) => {
  selected.value = i
  player.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Fallback platforms (Instagram/LinkedIn) can't be auto-embedded from a link
// alone, so we show a "watch on ..." card instead of a fake player.
const isFallback = computed(
  () => current.value?.platform === 'instagram' || current.value?.platform === 'linkedin' || current.value?.platform === 'unknown',
)

const fallbackLabel = computed(() => {
  switch (current.value?.platform) {
    case 'instagram': return 'Watch on Instagram'
    case 'linkedin': return 'Watch on LinkedIn'
    default: return 'Watch original video'
  }
})

// Twitter/X embeds need their widgets script loaded, and re-processed
// every time a different tweet is shown.
const hasTwitterVideo = computed(() => videos.value.some((v) => v.platform === 'twitter'))

useHead(() => ({
  script: hasTwitterVideo.value
    ? [{ src: 'https://platform.twitter.com/widgets.js', async: true, charset: 'utf-8' }]
    : [],
}))

watch(current, async () => {
  if (current.value?.platform !== 'twitter') return
  await nextTick()
  // @ts-expect-error injected globally by widgets.js
  window.twttr?.widgets?.load()
})
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
        <p v-if="error" class="text-center text-navy/60">
          Our videos will be available here shortly.
        </p>

        <template v-else-if="current">
          <!-- Player -->
          <div ref="player" class="relative">
            <div class="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-lavender via-peach/60 to-mint/60 blur-2xl" aria-hidden="true" />

            <!-- YouTube / Facebook: iframe embed -->
            <div
              v-if="current.platform === 'youtube' || current.platform === 'facebook'"
              class="relative aspect-video overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_80px_rgba(63,46,128,0.25)]"
            >
              <iframe
                :key="current.id"
                class="h-full w-full"
                :src="current.embedUrl!"
                :title="current.title"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowfullscreen
                loading="lazy"
              />
            </div>

            <!-- Direct file: native video player -->
            <div
              v-else-if="current.platform === 'direct'"
              class="relative aspect-video overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_80px_rgba(63,46,128,0.25)]"
            >
              <video
                :key="current.id"
                class="h-full w-full object-cover"
                :src="current.url"
                :poster="current.poster ?? undefined"
                controls
                playsinline
                preload="metadata"
              />
            </div>

            <!-- Twitter / X: official oEmbed -->
            <div
              v-else-if="current.platform === 'twitter' && current.embedHtml"
              class="relative max-h-[720px] overflow-y-auto rounded-[2rem] bg-white p-4 shadow-[0_30px_80px_rgba(63,46,128,0.15)] sm:p-6"
            >
              <div :key="current.id" v-html="current.embedHtml" />
            </div>

            <!-- Instagram / LinkedIn / unresolved: fallback card -->
            <div
              v-else
              class="relative flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-[2rem] bg-navy text-center shadow-[0_30px_80px_rgba(63,46,128,0.25)]"
            >
              <img
                v-if="current.poster"
                :src="current.poster"
                alt=""
                class="absolute inset-0 h-full w-full object-cover opacity-40"
              />
              <p class="relative max-w-[320px] px-6 text-white/90">
                This video can't be played directly here. You can still watch it on the original platform.
              </p>
              <a
                :href="current.url"
                target="_blank"
                rel="noopener"
                class="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
              >
                {{ fallbackLabel }}
                <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">{{ current.tag }}</p>
            <h2 class="mt-2 font-serif text-3xl font-semibold text-navy">{{ current.title }}</h2>
            <p class="mx-auto mt-2 max-w-[520px] text-navy/70">{{ current.description }}</p>
          </div>

          <!-- Playlist -->
          <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="(v, i) in videos"
              :key="v.id"
              type="button"
              class="group overflow-hidden rounded-[1.75rem] bg-white text-left shadow-[0_10px_40px_rgba(63,46,128,0.08)] ring-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.22)]"
              :class="selected === i ? 'ring-violet' : 'ring-transparent'"
              :aria-label="`Play: ${v.title}`"
              @click="pick(i)"
            >
              <div class="relative aspect-video overflow-hidden bg-lavender-soft">
                <img
                  v-if="v.poster"
                  :src="v.poster"
                  alt=""
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <span class="absolute inset-0 flex items-center justify-center bg-navy/20 transition-colors duration-500 group-hover:bg-navy/35">
                  <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-plum shadow-lg transition-transform duration-500 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" class="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z" /></svg>
                  </span>
                </span>
              </div>
              <div class="p-6">
                <p class="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-plum/60">{{ v.tag }}</p>
                <h3 class="mt-1 font-serif text-xl font-semibold text-navy">{{ v.title }}</h3>
                <p class="mt-1 text-sm text-navy/65">{{ v.description }}</p>
              </div>
            </button>
          </div>
        </template>

        <p v-else class="text-center text-navy/60">Videos are coming soon.</p>
      </div>
    </section>
  </main>
</template>