<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; accent?: string; text?: string }>()

const shown = ref(false)
onMounted(() => setTimeout(() => (shown.value = true), 80))
</script>

<template>
  <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#fff6ee] via-cream to-[#f4effb] px-6 pb-24 pt-36 sm:pt-44 lg:px-10 lg:pb-28">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute -left-24 top-16 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
      <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
      <span class="absolute left-[14%] top-[34%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
      <span class="absolute right-[18%] top-[28%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#e89a7a]/70 [animation-delay:2s]" />
    </div>

    <div
      class="mx-auto max-w-[760px] text-center transition-all duration-[900ms] ease-out"
      :class="shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
    >
      <p class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70">{{ eyebrow }}</p>
      <h1 class="mt-5 font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[1.08] text-navy">
        {{ title }}
        <em
          v-if="accent"
          class="animate-shimmer bg-[linear-gradient(90deg,#3f2e80,#7c5cc4,#e89a7a,#7c5cc4,#3f2e80)] bg-[length:200%_auto] bg-clip-text font-medium italic text-transparent"
        >{{ accent }}</em>
      </h1>
      <p v-if="text" class="mx-auto mt-6 max-w-[540px] text-[1.02rem] leading-relaxed text-navy/75">{{ text }}</p>
    </div>

    <svg class="absolute -bottom-px left-0 z-10 h-12 w-full sm:h-16 lg:h-20" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path class="fill-cream" d="M0 72C220 18 470 14 720 52s520 70 720 4v64H0Z" />
    </svg>
  </section>
</template>