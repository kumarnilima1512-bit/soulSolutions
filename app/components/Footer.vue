<script setup lang="ts">
const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/soul_solutions_official?exln=MWVkZmZ2ZDFmZWw4Yw%3D%3D',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1Cf4HV529u/',
  },
]

const links = [
  { label: 'Home', to: '/' },
  { label: 'Know About Us', to: '/about' },
  { label: 'Approaches', to: '/approaches' },
  { label: 'Services', to: '/services' },
  { label: 'Activity & Programme', to: '/activity' },
  { label: 'Mental Health Issues', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Videos', to: '/videos' },
  { label: 'Contact', to: '/contact' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy text-white">
    <div class="mx-auto max-w-[1240px] px-5 py-10 sm:px-6 lg:px-10 lg:py-16">
      <!-- Mobile: brand + explore side by side, contact below. Desktop: 3 columns -->
      <div class="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-[1.2fr_0.9fr_1.4fr] lg:gap-14">
        <!-- Brand -->
        <div class="min-w-0">
          <NuxtLink to="/" class="inline-flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3" aria-label="Soul Solutions home">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1 sm:h-14 sm:w-14 sm:p-1.5">
              <img src="/images/logo.png" alt="" class="h-full w-full object-contain" />
            </span>
            <span class="font-serif text-lg font-semibold leading-tight sm:text-2xl">Soul Solutions</span>
          </NuxtLink>

          <p class="mt-3 max-w-[340px] text-[0.75rem] leading-relaxed text-white/70 sm:mt-5 sm:text-[0.95rem]">
            Where the science of psychiatry meets human touch. <br />
            <span class="hidden sm:inline">A safe space where psychiatry and psychology work together for you.</span>
          </p>

          <!-- Social icons (same round style as phone and email) -->
          <div class="mt-4 flex items-center gap-2.5 sm:mt-6 sm:gap-3">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Soul Solutions on ${s.label}`"
              class="group flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-plum sm:h-10 sm:w-10"
            >
              <!-- Instagram -->
              <svg v-if="s.label === 'Instagram'" viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              <!-- Facebook -->
              <svg v-else viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 8h2.5V4.5H14A4 4 0 0 0 10 8.5V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V8.8c0-.5.3-.8.8-.8Z" />
              </svg>
            </a>
          </div>

          <!-- Phone + email, right under the social icons -->
          <ul class="mt-4 space-y-3 text-[0.78rem] text-white/80 sm:mt-5 sm:space-y-4 sm:text-[0.95rem]">
            <li>
              <a href="tel:+919874689332" class="group flex items-center gap-2.5 sm:gap-3.5" aria-label="Call us">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-plum sm:h-10 sm:w-10">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                </span>
                <span class="min-w-0 transition-colors duration-300 group-hover:text-white">+91 98746 89332</span>
              </a>
            </li>

            <li>
              <a href="mailto:soulsolutions.holisticrefuge@gmail.com" class="group flex items-center gap-2.5 sm:gap-3.5" aria-label="Email us">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-plum sm:h-10 sm:w-10">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <span class="min-w-0 leading-snug [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-white">
                  soulsolutions.holisticrefuge@gmail.com
                </span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Quick links -->
        <nav aria-label="Footer navigation" class="min-w-0">
          <p class="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/50 sm:text-xs">Explore</p>
          <ul class="mt-3 grid grid-cols-1 gap-y-2 text-[0.82rem] sm:mt-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 sm:text-[0.95rem]">
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

        <!-- Contact: full width on mobile, third column on desktop -->
        <div class="col-span-2 min-w-0 border-t border-white/10 pt-6 lg:col-span-1 lg:border-0 lg:pt-0">
          <p class="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/50 sm:text-xs">Get in touch</p>

          <ul class="mt-3 space-y-3 text-[0.82rem] text-white/80 sm:mt-5 sm:space-y-5 sm:text-[0.95rem]">
            <!-- Timings -->
            <li class="flex items-center gap-3 sm:gap-3.5">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-10 sm:w-10">
                <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div class="min-w-0">
                <p>9:00 AM – 9:00 PM (Offline)</p>
                <p>9:00 AM – 12:00 AM (Online)</p>
              </div>
            </li>

            <!-- Location + appointment note -->
            <li class="flex items-start gap-3 sm:gap-3.5">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-10 sm:w-10">
                <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div class="min-w-0">
                <a
                  href="https://maps.app.goo.gl/khGP5h69njtjg5aB8"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block leading-snug transition-colors duration-300 hover:text-white sm:leading-relaxed"
                >
                  Soul Solutions, Flat-5B, Sudarshan Apartment, B/38, Atabagan, Garia, Kolkata - 700084
                  <span class="mt-0.5 block text-white/55">Landmark: Chirar More</span>
                </a>

                <p class="mt-2.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[0.72rem] leading-relaxed text-white/75 sm:mt-3 sm:rounded-xl sm:px-4 sm:py-3 sm:text-[0.82rem]">
                  <span class="font-medium text-white">Visits are by appointment only.</span>
                  To ensure every patient receives our full attention, we are unable to accommodate
                  walk-ins. Patients with a confirmed appointment are seen first, so please
                  <NuxtLink to="/book" class="font-medium text-white underline underline-offset-2">book a session</NuxtLink>
                  before you visit.
                </p>
              </div>
            </li>
          </ul>

          <!-- Action buttons -->
          <div class="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <NuxtLink
              to="/book"
              class="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-plum transition-all duration-300 hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-sm"
            >
              Book a Session
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </NuxtLink>

            <a
              href="https://wa.me/919874689332"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-plum transition-all duration-300 hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-sm"
              >
                Contact Us
              </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-center text-[0.68rem] text-white/50 sm:mt-12 sm:flex-row sm:gap-3 sm:text-left sm:text-xs">
        <p>&copy; {{ year }} Soul Solutions. All rights reserved.</p>
        <p class="tracking-[0.2em] sm:tracking-[0.25em]">HEAL &nbsp;·&nbsp; UNDERSTAND &nbsp;·&nbsp; GROW</p>
      </div>
    </div>
  </footer>
</template>