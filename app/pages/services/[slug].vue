<script setup lang="ts">
import type { SBlock } from '~/utils/service-blocks'

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
  blocks: SBlock[]
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

    <!-- ============ CONTENT (from the Notion page) ============ -->
    <article class="bg-cream px-6 py-14 lg:px-10 lg:py-20">
      <div class="mx-auto max-w-[860px]">
        <ServiceBlocks v-if="service.blocks.length" :blocks="service.blocks" />
        <p v-else class="text-center text-navy/60">More details for this service are coming soon.</p>
      </div>

      <!-- ============ CONSULTANTS + FEES ============ -->
      <div v-if="service.consultants.length" class="mx-auto mt-16 max-w-[820px]">
        <h2 class="font-serif text-2xl font-semibold text-navy sm:text-3xl">Our consultants & fees</h2>
        <p class="mt-1 text-sm text-navy/60">All sessions are by prior appointment only.</p>

        <div class="mt-6 overflow-x-auto rounded-[1.5rem] bg-white shadow-[0_10px_40px_rgba(30,77,70,0.08)]">
          <table class="w-full min-w-[520px] text-left text-sm">
            <thead class="bg-lavender text-navy">
              <tr>
                <th class="px-5 py-4 font-medium">Consultant</th>
                <th class="px-3 py-4 font-medium">Offline<span class="block text-[0.65rem] font-normal text-navy/55">In clinic</span></th>
                <th class="px-3 py-4 font-medium">Online<span class="block text-[0.65rem] font-normal text-navy/55">Zoom / Meet</span></th>
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

        <p class="mt-3 text-sm font-semibold leading-relaxed text-plum">
          Online sessions are conducted via Zoom or Google Meet. Advance payment is required to confirm your appointment slot.
        </p>
        <p class="mt-2 text-sm font-semibold leading-relaxed text-plum">
          International consultations are also available. For international charges and details, please
          <NuxtLink to="/contact" class="font-bold text-navy underline underline-offset-2 transition-colors hover:text-plum">contact us</NuxtLink>.
        </p>
      </div>

      <div class="mx-auto mt-14 max-w-[860px] border-t border-plum/15 pt-8">
        <NuxtLink to="/services" class="group inline-flex items-center gap-2 font-medium text-plum">
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          Back to all services
        </NuxtLink>
      </div>
    </article>

    <!-- ============ CTA ============ -->
    <CtaBanner
      :to="`/book?service=${service.id}`"
      title="Ready to take the first step?"
      text=""
      button="Book an Appointment"
    />
  </main>
</template>