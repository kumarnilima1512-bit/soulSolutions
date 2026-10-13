<script setup lang="ts">

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/soul_solutions_official?exln=MWVkZmZ2ZDFmZWw4Yw%3D%3D',
    iconSrc: '/icons/instagram.png',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1Cf4HV529u/',
    iconSrc: '/icons/facebook.png',
    zoom: 1.35,
  },
]

const links = [
  { label: 'Home', to: '/' },
  { label: 'Know About Us', to: '/about' },
  { label: 'Approaches', to: '/approaches' },
  { label: 'Services', to: '/services' },
  { label: 'Mental Health', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Videos', to: '/videos' },
  { label: 'Contact', to: '/contact' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy text-white">
    <div class="mx-auto max-w-[1240px] px-6 py-14 lg:px-10 lg:py-16">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_1.4fr] lg:gap-14">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-3" aria-label="Soul Solutions home">
            <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-1.5">
              <img src="/images/logo.png" alt="" class="h-full w-full object-contain" />
            </span>
            <span class="font-serif text-2xl font-semibold">Soul Solutions</span>
          </NuxtLink>

          <p class="mt-5 max-w-[340px] text-[0.95rem] leading-relaxed text-white/70">
            Because healing isn't a destination, it's a journey. A safe space where psychiatry and
            psychology work together for you.
          </p>

          
          <!-- Social icons -->
<div class="mt-6 flex items-center gap-3">
  <a
    v-for="s in socials"
    :key="s.label"
    :href="s.href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`Soul Solutions on ${s.label}`"
    class="group flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(125,168,142,0.5)]"
  >
    <img
      :src="s.iconSrc"
      :alt="s.label"
      class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
      :style="{ transform: `scale(${s.zoom})` }"
      loading="lazy"
    />
  </a>
</div>
        </div>

        <!-- Quick links -->
        <nav aria-label="Footer navigation">
          <p class="text-xs font-medium uppercase tracking-[0.25em] text-white/50">Explore</p>
          <ul class="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem]">
            <li v-for="l in links" :key="l.to">
              <NuxtLink
                :to="l.to"
                class="text-white/75 transition-colors duration-300 hover:text-white"
              >
                {{ l.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Contact -->
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.25em] text-white/50">Get in touch</p>

          <ul class="mt-5 space-y-5 text-[0.95rem] text-white/80">
            <!-- Phone -->
            <li>
              <a href="tel:+919874689332" class="group flex items-center gap-3.5" aria-label="Call us">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-plum">
                  <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                </span>
                <span class="transition-colors duration-300 group-hover:text-white">+91 98746 89332</span>
              </a>
            </li>

            <!-- Email -->
            <li>
              <a href="mailto:soulsolutions.holisticrefuge@gmail.com" class="group flex items-center gap-3.5" aria-label="Email us">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-plum">
                  <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <span class="min-w-0 [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-white">
                  soulsolutions.holisticrefuge@gmail.com
                </span>
              </a>
            </li>

            <!-- Timings -->
            <li class="flex items-center gap-3.5">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span>11:00 AM – 9:00 PM</span>
            </li>

            <!-- Location + appointment note -->
            <li class="flex items-start gap-3.5">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div class="min-w-0">
                <a
                  href="https://maps.app.goo.gl/khGP5h69njtjg5aB8"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block leading-relaxed transition-colors duration-300 hover:text-white"
                >
                  Soul Solutions, Flat-5B, Sudarshan Apartment, B/38, Atabagan, Garia, Kolkata - 700084
                  <span class="mt-0.5 block text-white/55">Landmark: Chirar More</span>
                </a>

                <p class="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[0.82rem] leading-relaxed text-white/75">
                  <span class="font-medium text-white">Visits are by appointment only.</span>
                  To ensure every patient receives our full attention, we are unable to accommodate
                  walk-ins. Patients with a confirmed appointment are seen first, so please
                  <NuxtLink to="/book" class="font-medium text-white underline underline-offset-2">book a session</NuxtLink>
                  before you visit.
                </p>
              </div>
            </li>
          </ul>

          <NuxtLink
            to="/book"
            class="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-plum transition-all duration-300 hover:-translate-y-0.5"
          >
            Book a Session
            <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:flex-row sm:text-left">
        <p>&copy; {{ year }} Soul Solutions. All rights reserved.</p>
        <p class="tracking-[0.25em]">HEAL &nbsp;·&nbsp; UNDERSTAND &nbsp;·&nbsp; GROW</p>
      </div>
    </div>
  </footer>
</template>