<script setup lang="ts">
useSeoMeta({ title: 'Contact | Soul Solutions', description: 'Book a session or send us a message. We are here to listen.' })

const info = [
  {
    label: 'Call us',
    value: '+91 98746 89332',
    href: 'tel:+919874689332',
    external: false,
    bg: 'bg-lavender',
    icon: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  },
  {
    label: 'Email us',
    value: 'soulsolutions.holisticrefuge@gmail.com',
    href: 'mailto:soulsolutions.holisticrefuge@gmail.com',
    external: false,
    bg: 'bg-peach',
    icon: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  },
  {
    label: 'Visit us',
    value: 'Soul Solutions, Flat-5B, Sudarshan Apartment, B/38, Atabagan, Garia, Kolkata - 700084',
    note: 'Landmark: Chirar More',
    href: 'https://maps.app.goo.gl/khGP5h69njtjg5aB8',
    external: true,
    bg: 'bg-mint',
    icon: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  },
  {
    label: 'Timings',
    value: '11:00 AM – 9:00 PM',
    href: '',
    external: false,
    bg: 'bg-sky',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
]
</script>

<template>
  <main>
    <PageHeader
      eyebrow="Contact"
      title="We'd love to"
      accent="hear from you."
      text="Book a session or just say hello. There is no pressure and no judgment, only a real person who will listen."
    />

    <section class="bg-cream px-4 pb-16 sm:px-6 lg:px-10 lg:pb-28">
      <div class="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <!-- Booking form: first on mobile/tablet, right column on desktop -->
        <div class="relative order-1 min-w-0 overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-[0_20px_70px_rgba(30,77,70,0.12)] sm:rounded-[2rem] sm:p-10 lg:order-2">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-blob-a rounded-full bg-violet/10 blur-3xl max-md:animate-none" aria-hidden="true" />
          <BookingForm heading="Book a session" />
        </div>

        <!-- Info: below the form on mobile, left column on desktop -->
        <div class="order-2 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:order-1 lg:grid-cols-1 lg:content-start lg:gap-5">
          <component
            :is="c.href ? 'a' : 'div'"
            v-for="c in info"
            :key="c.label"
            :href="c.href || undefined"
            :target="c.external ? '_blank' : undefined"
            :rel="c.external ? 'noopener' : undefined"
            class="group flex min-w-0 items-start gap-4 rounded-[1.25rem] bg-white p-4 shadow-[0_10px_40px_rgba(30,77,70,0.07)] transition-all duration-500 active:scale-[0.99] sm:items-center sm:gap-5 sm:rounded-[1.75rem] sm:p-5 lg:hover:-translate-y-1.5 lg:hover:shadow-[0_24px_60px_rgba(125,168,142,0.28)]"
          >
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[45%_55%_50%_50%] text-plum transition-transform duration-500 group-hover:-translate-y-1 sm:h-14 sm:w-14" :class="c.bg">
              <svg viewBox="0 0 24 24" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-[0.65rem] uppercase tracking-[0.2em] text-plum/60 sm:text-xs">{{ c.label }}</span>
              <span class="mt-0.5 block text-[0.92rem] font-medium leading-snug text-navy [overflow-wrap:anywhere] sm:text-base">{{ c.value }}</span>
              <span v-if="c.note" class="mt-1 block text-[0.8rem] text-navy/60 sm:text-sm">{{ c.note }}</span>
              <span v-if="c.external" class="mt-2 inline-flex items-center gap-1 text-[0.85rem] font-medium text-plum sm:text-sm">
                Get directions
                <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </span>
          </component>

          <!-- QueryBox-->
          <QuickQuery class="sm:col-span-2 lg:col-span-1" />

          <div class="rounded-[1.25rem] bg-lavender-soft p-5 text-[0.82rem] leading-relaxed text-navy/75 sm:col-span-2 sm:rounded-[1.75rem] sm:p-6 sm:text-sm lg:col-span-1">
            <p class="font-medium text-navy">Need urgent help?</p>
            <p class="mt-1">
              If you or someone near you is in immediate danger or crisis, please contact your local
              emergency number or a mental health helpline right away. Our form is not monitored in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>