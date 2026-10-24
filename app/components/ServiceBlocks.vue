<script setup lang="ts">
import type { SBlock } from '~/utils/service-blocks'

const props = defineProps<{ blocks: SBlock[] }>()

interface ListGroup {
  type: 'list'
  id: string
  ordered: boolean
  items: SBlock[]
}
type Group = SBlock | ListGroup

// Joins neighbouring list items into one list
const groups = computed<Group[]>(() => {
  const out: Group[] = []
  for (const b of props.blocks ?? []) {
    const bulleted = b.type === 'bulleted_list_item'
    const numbered = b.type === 'numbered_list_item'

    if (bulleted || numbered) {
      const last = out[out.length - 1]
      if (last && last.type === 'list' && (last as ListGroup).ordered === numbered) {
        ;(last as ListGroup).items.push(b)
      } else {
        out.push({ type: 'list', id: `list-${b.id}`, ordered: numbered, items: [b] })
      }
    } else {
      out.push(b)
    }
  }
  return out
})

const asList = (g: Group) => g as ListGroup
const asBlock = (g: Group) => g as SBlock

const hasText = (b: SBlock) => (b.runs ?? []).some((r) => r.text.trim())

// Literal class names, so Tailwind includes them
const colClass: Record<number, string> = {
  1: '',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}
</script>

<template>
  <div>
    <template v-for="g in groups" :key="g.id">
      <!-- Lists -->
      <ul
        v-if="g.type === 'list' && !asList(g).ordered"
        class="mb-5 list-disc space-y-2 pl-6 leading-relaxed text-navy/80"
      >
        <li v-for="item in asList(g).items" :key="item.id">
          <ServiceRuns :runs="item.runs" />
          <ServiceBlocks v-if="item.children?.length" :blocks="item.children" class="mt-2" />
        </li>
      </ul>

      <ol
        v-else-if="g.type === 'list' && asList(g).ordered"
        class="mb-5 list-decimal space-y-2 pl-6 leading-relaxed text-navy/80"
      >
        <li v-for="item in asList(g).items" :key="item.id">
          <ServiceRuns :runs="item.runs" />
          <ServiceBlocks v-if="item.children?.length" :blocks="item.children" class="mt-2" />
        </li>
      </ol>

      <!-- Headings -->
      <h2
        v-else-if="g.type === 'heading_1'"
        class="mb-4 mt-10 font-serif text-3xl font-semibold text-navy first:mt-0"
      ><ServiceRuns :runs="asBlock(g).runs" /></h2>
      <h3
        v-else-if="g.type === 'heading_2'"
        class="mb-3 mt-9 font-serif text-2xl font-semibold text-navy first:mt-0"
      ><ServiceRuns :runs="asBlock(g).runs" /></h3>
      <h4
        v-else-if="g.type === 'heading_3'"
        class="mb-3 mt-8 font-serif text-xl font-semibold text-navy first:mt-0"
      ><ServiceRuns :runs="asBlock(g).runs" /></h4>

      <!-- Paragraph -->
      <p
        v-else-if="g.type === 'paragraph'"
        class="mb-5 whitespace-pre-line leading-relaxed text-navy/80"
        :class="{ hidden: !hasText(asBlock(g)) }"
      ><ServiceRuns :runs="asBlock(g).runs" /></p>

      <!-- Quote -->
      <blockquote
        v-else-if="g.type === 'quote'"
        class="my-6 border-l-2 border-violet/50 pl-5 font-serif text-xl italic leading-snug text-navy/80"
      >
        <ServiceRuns :runs="asBlock(g).runs" />
        <ServiceBlocks v-if="asBlock(g).children?.length" :blocks="asBlock(g).children!" class="mt-3 not-italic" />
      </blockquote>

      <!-- Callout -->
      <div
        v-else-if="g.type === 'callout'"
        class="my-6 flex gap-3 rounded-2xl bg-lavender-soft p-5 leading-relaxed text-navy/80"
      >
        <span v-if="asBlock(g).icon" class="text-xl leading-none" aria-hidden="true">{{ asBlock(g).icon }}</span>
        <div class="min-w-0 flex-1">
          <p class="whitespace-pre-line"><ServiceRuns :runs="asBlock(g).runs" /></p>
          <ServiceBlocks v-if="asBlock(g).children?.length" :blocks="asBlock(g).children!" class="mt-3" />
        </div>
      </div>

      <!-- Toggle = FAQ accordion (down arrow, click to open the answer) -->
      <details
        v-else-if="g.type === 'toggle'"
        class="group mb-3 overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(30,77,70,0.07)]"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-navy [&::-webkit-details-marker]:hidden">
          <span><ServiceRuns :runs="asBlock(g).runs" /></span>
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 shrink-0 text-plum transition-transform duration-300 group-open:rotate-180"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          ><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div class="px-5 pb-5 leading-relaxed text-navy/75">
          <ServiceBlocks v-if="asBlock(g).children?.length" :blocks="asBlock(g).children!" />
        </div>
      </details>

      <!-- Columns: side by side on desktop, stacked on mobile -->
      <div
        v-else-if="g.type === 'column_list'"
        class="my-8 grid gap-6"
        :class="colClass[Math.min(asBlock(g).children?.length ?? 1, 4)]"
      >
        <div v-for="col in asBlock(g).children ?? []" :key="col.id" class="min-w-0">
          <ServiceBlocks :blocks="col.children ?? []" />
        </div>
      </div>

      <!-- Image -->
      <figure v-else-if="g.type === 'image' && asBlock(g).url" class="my-8">
        <img
          :src="asBlock(g).url!"
          :alt="asBlock(g).caption || ''"
          loading="lazy"
          class="mx-auto w-full rounded-[1.5rem]"
        />
        <figcaption v-if="asBlock(g).caption" class="mt-2 text-center text-sm text-navy/55">
          {{ asBlock(g).caption }}
        </figcaption>
      </figure>

      <!-- Divider -->
      <hr v-else-if="g.type === 'divider'" class="my-10 border-plum/15" />
    </template>
  </div>
</template>