<script setup lang="ts">
useSeoMeta({
  title: 'Services | Soul Solutions',
  description: 'Compassionate, professional support for every step of your mental health journey.',
})

interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
  image: string | null
}

const { data: services, error } = await useFetch<Service[]>('/api/services', { default: () => [] })

const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))

function useReveal(threshold = 0.1) {
  const el = ref<HTMLElement | null>(null)
  const shown = ref(false)
  useIntersectionObserver(el, ([entry]) => { if (entry?.isIntersecting) shown.value = true }, { threshold })
  return { el, shown }
}
const { el: gridEl, shown: gridShown } = useReveal()
</script>

<template>
  <main>
    <!-- ============ HEADER ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-16 pt-32 sm:pt-40 lg:px-10 lg:pb-20">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-10 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
        <span class="absolute left-[14%] top-[32%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
        <span class="absolute right-[18%] top-[26%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#e89a7a]/70 [animation-delay:2s]" />
      </div>

      <div
        class="mx-auto max-w-[760px] text-center transition-all duration-[900ms] ease-out"
        :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
      >
        <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">Our Services</p>
        <h1 class="mt-5 font-serif text-[clamp(2.4rem,5.4vw,4.2rem)] font-semibold leading-[1.08] text-navy">
          Support for every
          <em class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium italic text-transparent">
            step of your journey.
          </em>
        </h1>
        <p class="mx-auto mt-5 max-w-[540px] text-[1.02rem] leading-relaxed text-navy/75">
          Whether you're feeling overwhelmed, stuck, or simply want to grow, Soul Solutions offers
          compassionate, professional mental-health support tailored to you.
        </p>
      </div>
    </section>

    <p v-if="error" class="px-6 py-24 text-center text-navy/60">
      Our services will be available here shortly.
    </p>

    <!-- ============ GRID ============ -->
    <section v-else ref="gridEl" class="bg-cream px-6 pb-24 lg:px-10">
      <div class="mx-auto max-w-[1240px]">
        <div v-if="services.length === 0" class="text-center text-navy/60">
          Services are being added soon.
        </div>

        <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(s, i) in services"
            :key="s.id"
            :to="`/services/${s.slug}`"
            class="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_rgba(63,46,128,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.22)]"
            :class="gridShown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
            :style="{ transitionDelay: `${i * 100}ms`, transitionDuration: '900ms', transitionProperty: 'opacity, transform' }"
          >
            <div class="aspect-[4/3] overflow-hidden bg-lavender-soft">
              <img
                v-if="s.image"
                :src="s.image"
                :alt="s.name"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-peach" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="h-10 w-10 text-plum/40" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z" />
                </svg>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-7">
              <h2 class="font-serif text-xl font-semibold text-navy transition-colors duration-300 group-hover:text-plum">
                {{ s.name }}
              </h2>
              <p class="mt-2 flex-1 text-[0.92rem] leading-relaxed text-navy/70">{{ s.shortDescription }}</p>

              <span class="group/link mt-5 inline-flex items-center gap-2 text-sm font-medium text-plum">
                Learn more
                <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="bg-white px-6 pb-24 lg:px-10">
      <div class="relative mx-auto max-w-[1000px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2d2660] via-plum to-[#6b4fb0] px-8 py-14 text-center shadow-[0_30px_80px_rgba(63,46,128,0.3)] sm:px-16">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <span class="absolute left-[10%] top-[20%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
          <span class="absolute right-[14%] top-[26%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2s]" />
        </div>
        <h2 class="relative font-serif text-2xl font-semibold text-white sm:text-3xl">
          Not sure which service is right for you?
        </h2>
        <p class="relative mx-auto mt-3 max-w-[440px] text-white/80">
          Book a joint consultation and we'll help you find the right kind of support together.
        </p>
        <NuxtLink
          to="/contact"
          class="group relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
        >
          Book a Joint Consultation
          <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>