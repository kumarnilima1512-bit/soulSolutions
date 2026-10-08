<script setup lang="ts">
interface Run { text: string; bold: boolean; italic: boolean; code: boolean; href: string | null }
interface Block { id: string; type: string; runs?: Run[]; url?: string | null; caption?: string }
interface ListGroup { type: 'list'; ordered: boolean; items: Run[][] }
type RenderGroup = Block | ListGroup

interface Consultant {
  id: string
  name: string
  role: string
  photo_url: string | null
  fees: { offline: number | null; online: number | null; international: number | null }
}

interface ServiceDetail {
  id: string
  name: string
  shortDescription: string
  image: string | null
  blocks: Block[]
  consultants: Consultant[]
}

const route = useRoute()
const slug = route.params.slug as string

const { data: service, error } = await useFetch<ServiceDetail>(`/api/services/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

useSeoMeta({
  title: () => `${service.value?.name ?? 'Service'} | Soul Solutions`,
  description: () => service.value?.shortDescription,
  ogImage: () => service.value?.image ?? undefined,
})

const listGroups = computed<RenderGroup[]>(() => {
  const groups: RenderGroup[] = []
  for (const b of service.value?.blocks ?? []) {
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

const rupee = (n: number | null) => (n == null ? '—' : `₹ ${n.toLocaleString('en-IN')}`)

const initials = (name: string) =>
  name.replace(/^(Dr|Ms|Mr|Mrs)\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
</script>

<template>
  <main v-if="service">
    <!-- ============ HEADER ============ -->
    <section class="bg-gradient-to-br from-[#f2ede1] via-cream to-[#edf5f0] px-6 pb-10 pt-32 sm:pt-40 lg:px-10 lg:pb-14">
      <div class="mx-auto max-w-[760px] text-center">
        <nav aria-label="Breadcrumb" class="text-[0.72rem] uppercase tracking-[0.3em] text-plum/70">
          <NuxtLink to="/services" class="transition-colors hover:text-plum">Services</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-plum">{{ service.name }}</span>
        </nav>

        <h1 class="mt-5 font-serif text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.15] text-navy">
          {{ service.name }}
        </h1>

        <p v-if="service.shortDescription" class="mx-auto mt-4 max-w-[560px] leading-relaxed text-navy/75">
          {{ service.shortDescription }}
        </p>

        <NuxtLink
          :to="`/book?service=${service.id}`"
          class="group mt-7 inline-flex items-center gap-2 rounded-full bg-plum px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(30,77,70,0.4)]"
        >
          Book an Appointment
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </section>

    <!-- ============ IMAGE ============ -->
    <section v-if="service.image" class="bg-cream px-6 pb-4 lg:px-10">
      <div class="mx-auto aspect-[16/9] max-w-[1000px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(30,77,70,0.15)]">
        <img :src="service.image" :alt="service.name" class="h-full w-full object-cover" fetchpriority="high" />
      </div>
    </section>

    <!-- ============ CONTENT ============ -->
    <article class="bg-cream px-6 py-14 lg:px-10 lg:py-20">
      <div class="mx-auto max-w-[720px]">
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
            <img :src="group.url" :alt="group.caption || service.name" loading="lazy" class="w-full rounded-[1.5rem]" />
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

        <p v-if="listGroups.length === 0" class="text-center text-navy/60">
          More details for this service are coming soon.
        </p>
      </div>

      <!-- ============ CONSULTANTS + FEES ============ -->
      <div v-if="service.consultants.length" class="mx-auto mt-16 max-w-[820px]">
        <h2 class="font-serif text-2xl font-semibold text-navy sm:text-3xl">Our consultants & fees</h2>
        <p class="mt-1 text-sm text-navy/60">All sessions are by prior appointment only.</p>

        <div class="mt-6 overflow-x-auto rounded-[1.5rem] bg-white shadow-[0_10px_40px_rgba(30,77,70,0.08)]">
          <table class="w-full min-w-[620px] text-left text-sm">
            <thead class="bg-lavender text-navy">
              <tr>
                <th class="px-5 py-4 font-medium">Consultant</th>
                <th class="px-3 py-4 font-medium">Offline<span class="block text-[0.65rem] font-normal text-navy/55">In clinic</span></th>
                <th class="px-3 py-4 font-medium">Online<span class="block text-[0.65rem] font-normal text-navy/55">Zoom / Meet</span></th>
                <th class="px-3 py-4 font-medium">International<span class="block text-[0.65rem] font-normal text-navy/55">INR</span></th>
                <th class="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in service.consultants" :key="c.id" class="border-t border-plum/10">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <span class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-lavender-soft">
                      <img v-if="c.photo_url" :src="c.photo_url" :alt="c.name" class="h-full w-full object-cover" />
                      <span v-else class="flex h-full w-full items-center justify-center font-serif text-xs font-semibold text-plum">{{ initials(c.name) }}</span>
                    </span>
                    <span>
                      <span class="block font-medium text-navy">{{ c.name }}</span>
                      <span class="block text-xs text-navy/55">{{ c.role }}</span>
                    </span>
                  </div>
                </td>
                <td class="px-3 py-4 font-medium text-navy/85">{{ rupee(c.fees.offline) }}</td>
                <td class="px-3 py-4 font-medium text-navy/85">{{ rupee(c.fees.online) }}</td>
                <td class="px-3 py-4 font-medium text-navy/85">{{ rupee(c.fees.international) }}</td>
                <td class="px-5 py-4 text-right">
                  <NuxtLink
                    :to="`/book?service=${service.id}&doctor=${c.id}`"
                    class="inline-block whitespace-nowrap rounded-full bg-plum px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Book appointment
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mt-3 text-xs leading-relaxed text-navy/50">
          Online sessions are conducted via Zoom or Google Meet. Advance payment is required to confirm your appointment slot. International fees are charged in Indian Rupees (INR).
        </p>
      </div>

      <div class="mx-auto mt-14 max-w-[720px] border-t border-plum/15 pt-8">
        <NuxtLink to="/services" class="group inline-flex items-center gap-2 font-medium text-plum">
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          Back to all services
        </NuxtLink>
      </div>
    </article>

    <!-- ============ CTA ============ -->
    <section class="bg-white px-6 pb-24 lg:px-10">
      <div class="relative mx-auto max-w-[900px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#15352f] via-plum to-[#3d6b5c] px-8 py-14 text-center shadow-[0_30px_80px_rgba(30,77,70,0.3)] sm:px-14">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <span class="absolute left-[12%] top-[20%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
          <span class="absolute right-[14%] top-[26%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2s]" />
        </div>
        <h2 class="relative font-serif text-2xl font-semibold text-white sm:text-3xl">
          Ready to take the first step?
        </h2>
        <NuxtLink
          :to="`/book?service=${service.id}`"
          class="group relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
        >
          Book an Appointment
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>