<script setup lang="ts">
useSeoMeta({
  title: 'Blog | Soul Solutions',
  description: 'Thoughtful reads on mental health, relationships and everyday well-being.',
})

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  cover: string | null
  category: string
  author: string
  date: string | null
  featured: boolean
}

const { data: posts, error } = await useFetch<Post[]>('/api/blog', { default: () => [] })

const featured = computed(() => posts.value.find((p) => p.featured) ?? posts.value[0] ?? null)
const rest = computed(() => posts.value.filter((p) => p.id !== featured.value?.id))

const categories = computed(() => ['All', ...new Set(rest.value.map((p) => p.category))])
const active = ref('All')
const filtered = computed(() =>
  active.value === 'All' ? rest.value : rest.value.filter((p) => p.category === active.value),
)

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
</script>

<template>
  <main>
    <!-- ============ HEADER ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-16 pt-32 sm:pt-40 lg:px-10 lg:pb-20">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-10 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
      </div>

      <div
        class="mx-auto max-w-[760px] text-center transition-all duration-[900ms] ease-out"
        :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
      >
        <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">The Soul Solutions Blog</p>
        <h1 class="mt-5 font-serif text-[clamp(2.4rem,5.4vw,4.2rem)] font-semibold leading-[1.08] text-navy">
          Thoughtful reads for a
          <em class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium italic text-transparent">
            calmer mind.
          </em>
        </h1>
        <p class="mx-auto mt-5 max-w-[520px] text-[1.02rem] leading-relaxed text-navy/75">
          Notes on mental health, relationships and everyday well-being, written by our team of
          psychiatrists and psychologists.
        </p>
      </div>
    </section>

    <p v-if="error" class="px-6 py-24 text-center text-navy/60">
      Our blog posts will be available here shortly.
    </p>

    <template v-else>
      <!-- ============ FEATURED POST ============ -->
      <section v-if="featured" class="bg-white px-6 pb-14 pt-4 lg:px-10 lg:pb-20">
        <NuxtLink
          :to="`/blog/${featured.slug}`"
          class="group mx-auto grid max-w-[1240px] items-center gap-0 overflow-hidden rounded-[2rem] bg-lavender-soft shadow-[0_20px_60px_rgba(63,46,128,0.12)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(124,92,196,0.22)] lg:grid-cols-2"
        >
          <div class="aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
            <img
              v-if="featured.cover"
              :src="featured.cover"
              :alt="featured.title"
              class="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              fetchpriority="high"
            />
            <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-peach" aria-hidden="true" />
          </div>

          <div class="p-8 sm:p-12">
            <span class="rounded-full bg-plum/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-plum">
              Featured · {{ featured.category }}
            </span>
            <h2 class="mt-5 font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.15] text-navy transition-colors duration-300 group-hover:text-plum">
              {{ featured.title }}
            </h2>
            <p class="mt-3 leading-relaxed text-navy/70">{{ featured.excerpt }}</p>
            <div class="mt-6 flex items-center gap-3 text-sm text-navy/60">
              <span>{{ featured.author }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ formatDate(featured.date) }}</span>
            </div>
            <span class="group mt-6 inline-flex items-center gap-2 font-medium text-plum">
              Read the article
              <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </div>
        </NuxtLink>
      </section>

      <!-- ============ FILTER + GRID ============ -->
      <section class="bg-cream px-6 pb-24 lg:px-10">
        <div class="mx-auto max-w-[1240px]">
          <div class="flex flex-wrap justify-center gap-3" role="group" aria-label="Filter posts by category">
            <button
              v-for="c in categories"
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

          <div v-if="filtered.length === 0" class="mt-16 text-center text-navy/60">
            More posts in this category are coming soon.
          </div>

          <TransitionGroup
            v-else
            tag="div"
            class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            enter-active-class="transition duration-700 ease-out"
            enter-from-class="opacity-0 translate-y-6"
            leave-active-class="hidden"
          >
            <NuxtLink
              v-for="post in filtered"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              class="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.22)]"
            >
              <div class="aspect-[16/10] overflow-hidden">
                <img
                  v-if="post.cover"
                  :src="post.cover"
                  :alt="post.title"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-peach" aria-hidden="true" />
              </div>
              <div class="flex flex-1 flex-col p-6">
                <span class="text-xs font-medium uppercase tracking-[0.15em] text-plum/70">{{ post.category }}</span>
                <h3 class="mt-2 font-serif text-xl font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-plum">
                  {{ post.title }}
                </h3>
                <p class="mt-2 flex-1 text-[0.92rem] leading-relaxed text-navy/65">{{ post.excerpt }}</p>
                <div class="mt-5 flex items-center gap-2 text-xs text-navy/55">
                  <span>{{ post.author }}</span>
                  <span aria-hidden="true">·</span>
                  <span>{{ formatDate(post.date) }}</span>
                </div>
              </div>
            </NuxtLink>
          </TransitionGroup>
        </div>
      </section>
    </template>
  </main>
</template>