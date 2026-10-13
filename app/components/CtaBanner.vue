<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    text?: string
    button?: string // pass button="" to hide the button
    to?: string
    tone?: 'white' | 'cream' // background of the strip around the card
  }>(),
  {
    title: 'Your story can start here.',
    text: 'Book a session and take the first step, at your own pace.',
    button: 'Book a Consultation',
    to: '/book',
    tone: 'white',
  },
)
</script>

<template>
  <section class="px-4 pb-20 pt-4 sm:px-6 lg:px-10 lg:pb-24" :class="tone === 'cream' ? 'bg-cream' : 'bg-white'">
    <div class="relative mx-auto max-w-[1000px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#15352f] via-plum to-[#3d6b5c] px-6 py-12 text-center shadow-[0_30px_80px_rgba(30,77,70,0.3)] sm:px-16 sm:py-14">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <span class="absolute left-[10%] top-[20%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white" />
        <span class="absolute right-[14%] top-[26%] h-1 w-1 animate-twinkle rounded-full bg-white [animation-delay:2s]" />
      </div>

      <h2 class="relative font-serif text-2xl font-semibold text-white sm:text-3xl">{{ title }}</h2>
      <p v-if="text" class="relative mx-auto mt-3 max-w-[440px] text-white/80">{{ text }}</p>

      <NuxtLink
        v-if="button"
        :to="to"
        class="group relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
      >
        {{ button }}
        <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </NuxtLink>
    </div>
  </section>
</template>