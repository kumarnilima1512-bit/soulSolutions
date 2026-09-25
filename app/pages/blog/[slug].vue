<script setup lang="ts">
interface Run {
  text: string
  bold: boolean
  italic: boolean
  code: boolean
  href: string | null
}

interface Block {
  id: string
  type: string
  runs?: Run[]
  url?: string | null
  caption?: string
}

// A rendered group is either a raw block, or a merged list of consecutive
// bulleted/numbered items grouped into one <ul>/<ol>.
interface ListGroup {
  type: 'list'
  ordered: boolean
  items: Run[][]
}
type RenderGroup = Block | ListGroup

interface PostDetail {
  title: string
  excerpt: string
  cover: string | null
  category: string
  author: string
  date: string | null
  blocks: Block[]
}

const route = useRoute()
const slug = route.params.slug as string

const { data: post, error } = await useFetch<PostDetail>(`/api/blog/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: () => `${post.value?.title ?? 'Blog'} | Soul Solutions`,
  description: () => post.value?.excerpt,
  ogImage: () => post.value?.cover ?? undefined,
})

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const readingTime = computed(() => {
  const words = (post.value?.blocks ?? [])
    .flatMap((b) => b.runs ?? [])
    .reduce((sum, r) => sum + r.text.split(/\s+/).filter(Boolean).length, 0)
  return Math.max(1, Math.round(words / 180))
})

// Merge consecutive bulleted/numbered list items into a single list group,
// so the template can render one <ul>/<ol> instead of one per item.
const listGroups = computed<RenderGroup[]>(() => {
  const groups: RenderGroup[] = []

  for (const b of post.value?.blocks ?? []) {
    const isBulleted = b.type === 'bulleted_list_item'
    const isNumbered = b.type === 'numbered_list_item'

    if (isBulleted || isNumbered) {
      const last = groups[groups.length - 1]
      const lastIsMatchingList =
        last !== undefined && 'items' in last && last.type === 'list' && last.ordered === isNumbered

      if (lastIsMatchingList) {
        ;(last as ListGroup).items.push(b.runs ?? [])
      } else {
        groups.push({ type: 'list', ordered: isNumbered, items: [b.runs ?? []] })
      }
    } else {
      groups.push(b)
    }
  }

  return groups
})

const isListGroup = (g: RenderGroup): g is ListGroup => g.type === 'list' && 'items' in g
</script>

<template>
  <main v-if="post">
    <!-- ============ HEADER ============ -->
    <section class="bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-10 pt-32 sm:pt-40 lg:px-10 lg:pb-14">
      <div class="mx-auto max-w-[760px] text-center">
        <nav aria-label="Breadcrumb" class="text-[0.72rem] uppercase tracking-[0.3em] text-plum/70">
          <NuxtLink to="/blog" class="transition-colors hover:text-plum">Blog</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-plum">{{ post.category }}</span>
        </nav>

        <h1 class="mt-5 font-serif text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.15] text-navy">
          {{ post.title }}
        </h1>

        <div class="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-navy/65">
          <span>{{ post.author }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ formatDate(post.date) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ readingTime }} min read</span>
        </div>
      </div>
    </section>

    <!-- ============ COVER ============ -->
    <section v-if="post.cover" class="bg-cream px-6 pb-4 lg:px-10">
      <div class="mx-auto aspect-[16/9] max-w-[1000px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(63,46,128,0.15)]">
        <img :src="post.cover" :alt="post.title" class="h-full w-full object-cover" fetchpriority="high" />
      </div>
    </section>

    <!-- ============ CONTENT ============ -->
    <article class="bg-cream px-6 py-14 lg:px-10 lg:py-20">
      <div class="prose-blog mx-auto max-w-[720px]">
        <template v-for="(group, gi) in listGroups" :key="isListGroup(group) ? `list-${gi}` : group.id">
          <ul v-if="isListGroup(group) && !group.ordered" class="mb-5 list-disc space-y-2 pl-6 leading-relaxed text-navy/80">
            <li v-for="(item, i) in group.items" :key="i">
              <template v-for="(r, j) in item" :key="j">
                <a v-if="r.href" :href="r.href" target="_blank" rel="noopener" class="text-plum underline underline-offset-2">{{ r.text }}</a>
                <code v-else-if="r.code" class="rounded bg-plum/10 px-1.5 py-0.5 text-[0.9em] text-plum">{{ r.text }}</code>
                <strong v-else-if="r.bold"><em v-if="r.italic">{{ r.text }}</em><template v-else>{{ r.text }}</template></strong>
                <em v-else-if="r.italic">{{ r.text }}</em>
                <template v-else>{{ r.text }}</template>
              </template>
            </li>
          </ul>

          <ol v-else-if="isListGroup(group) && group.ordered" class="mb-5 list-decimal space-y-2 pl-6 leading-relaxed text-navy/80">
            <li v-for="(item, i) in group.items" :key="i">
              <template v-for="(r, j) in item" :key="j">
                <a v-if="r.href" :href="r.href" target="_blank" rel="noopener" class="text-plum underline underline-offset-2">{{ r.text }}</a>
                <code v-else-if="r.code" class="rounded bg-plum/10 px-1.5 py-0.5 text-[0.9em] text-plum">{{ r.text }}</code>
                <strong v-else-if="r.bold"><em v-if="r.italic">{{ r.text }}</em><template v-else>{{ r.text }}</template></strong>
                <em v-else-if="r.italic">{{ r.text }}</em>
                <template v-else>{{ r.text }}</template>
              </template>
            </li>
          </ol>

          <h2 v-else-if="!isListGroup(group) && group.type === 'heading_1'" class="mb-4 mt-10 font-serif text-3xl font-semibold text-navy first:mt-0">
            <template v-for="(r, j) in group.runs" :key="j">{{ r.text }}</template>
          </h2>
          <h3 v-else-if="!isListGroup(group) && group.type === 'heading_2'" class="mb-3 mt-9 font-serif text-2xl font-semibold text-navy first:mt-0">
            <template v-for="(r, j) in group.runs" :key="j">{{ r.text }}</template>
          </h3>
          <h4 v-else-if="!isListGroup(group) && group.type === 'heading_3'" class="mb-3 mt-8 font-serif text-xl font-semibold text-navy first:mt-0">
            <template v-for="(r, j) in group.runs" :key="j">{{ r.text }}</template>
          </h4>

          <blockquote v-else-if="!isListGroup(group) && group.type === 'quote'" class="my-6 border-l-2 border-violet/50 pl-5 font-serif text-xl italic leading-snug text-navy/80">
            <template v-for="(r, j) in group.runs" :key="j">{{ r.text }}</template>
          </blockquote>

          <figure v-else-if="!isListGroup(group) && group.type === 'image' && group.url" class="my-8">
            <img :src="group.url" :alt="group.caption || post.title" loading="lazy" class="w-full rounded-[1.5rem]" />
            <figcaption v-if="group.caption" class="mt-2 text-center text-sm text-navy/55">{{ group.caption }}</figcaption>
          </figure>

          <hr v-else-if="!isListGroup(group) && group.type === 'divider'" class="my-10 border-plum/15" />

          <p v-else-if="!isListGroup(group) && group.type === 'paragraph'" class="mb-5 leading-relaxed text-navy/80">
            <template v-for="(r, j) in group.runs" :key="j">
              <a v-if="r.href" :href="r.href" target="_blank" rel="noopener" class="text-plum underline underline-offset-2">{{ r.text }}</a>
              <code v-else-if="r.code" class="rounded bg-plum/10 px-1.5 py-0.5 text-[0.9em] text-plum">{{ r.text }}</code>
              <strong v-else-if="r.bold"><em v-if="r.italic">{{ r.text }}</em><template v-else>{{ r.text }}</template></strong>
              <em v-else-if="r.italic">{{ r.text }}</em>
              <template v-else>{{ r.text }}</template>
            </template>
          </p>
        </template>
      </div>

      <!-- Back link -->
      <div class="mx-auto mt-14 max-w-[720px] border-t border-plum/15 pt-8">
        <NuxtLink to="/blog" class="group inline-flex items-center gap-2 font-medium text-plum">
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          Back to all articles
        </NuxtLink>
      </div>
    </article>

    <!-- ============ CTA ============ -->
    <section class="bg-white px-6 pb-24 lg:px-10">
      <div class="relative mx-auto max-w-[900px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2d2660] via-plum to-[#6b4fb0] px-8 py-14 text-center shadow-[0_30px_80px_rgba(63,46,128,0.3)] sm:px-14">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <span class="absolute left-[12%] top-[20%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
          <span class="absolute right-[14%] top-[26%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2s]" />
        </div>
        <h2 class="relative font-serif text-2xl font-semibold text-white sm:text-3xl">
          Ready to talk to someone who understands?
        </h2>
        <NuxtLink
          to="/contact"
          class="group relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
        >
          Book a Joint Consultation
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>