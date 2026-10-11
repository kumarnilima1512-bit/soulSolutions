<script setup lang="ts">
useSeoMeta({
  title: 'Book a Session | Soul Solutions',
  description: 'Choose a doctor, pick an available date and book your session with Soul Solutions.',
})

const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))
</script>

<template>
  <main>
    <!-- ============ HERO ============ -->
    <section class="relative isolate overflow-hidden bg-gradient-to-br from-[#f2ede1] via-cream to-[#edf5f0] px-6 pb-14 pt-32 sm:pt-40 lg:px-10 lg:pb-16">
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute -left-24 top-10 h-72 w-72 animate-blob-a rounded-full bg-lavender/80 blur-3xl max-md:animate-none" />
        <div class="absolute -right-20 top-1/3 h-80 w-80 animate-blob-b rounded-full bg-peach/70 blur-3xl max-md:animate-none" />
        <span class="absolute left-[14%] top-[32%] h-2 w-2 animate-twinkle rounded-full bg-violet/50" />
        <span class="absolute right-[18%] top-[26%] h-1.5 w-1.5 animate-twinkle rounded-full bg-[#c9b88c]/70 [animation-delay:2s]" />
      </div>

      <div class="mx-auto max-w-[720px] text-center">
        <p
          class="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-plum/70 transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          Book a Session
        </p>
        <h1
          class="mt-5 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.1] text-navy transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[8px]'"
          style="transition-delay: 200ms"
        >
          Choose your doctor,
          <em class="animate-shimmer bg-[linear-gradient(90deg,#1e4d46,#7da88e,#c9b88c,#7da88e,#1e4d46)] bg-[length:200%_auto] bg-clip-text font-medium italic text-transparent">
            find a time that works.
          </em>
        </h1>
        <p
          class="mx-auto mt-5 max-w-[480px] text-[1.02rem] leading-relaxed text-navy/75 transition-all duration-[900ms] ease-out"
          :class="heroShown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
          style="transition-delay: 500ms"
        >
          Pick a doctor, and we'll show you exactly which days and times they're available.
        </p>
      </div>
    </section>

    <!-- ============ FORM ============ -->
    <section class="bg-cream px-6 pb-24 lg:px-10">
      <div class="mx-auto max-w-[820px]">
        <div class="relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_20px_70px_rgba(30,77,70,0.1)] sm:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-blob-a rounded-full bg-violet/10 blur-3xl max-md:animate-none" aria-hidden="true" />
          <BookingForm />
        </div>
      </div>
    </section>
  </main>
</template>