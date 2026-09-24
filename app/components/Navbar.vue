<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Blog', to: '/blog' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Videos', to: '/videos' },
  { label: 'Contact', to: '/contact' },
]

const route = useRoute()
const isActive = (to: string) => route.path === to

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 24)

const open = ref(false)
onKeyStroke('Escape', () => (open.value = false))
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      scrolled
        ? 'bg-cream/70 py-3 shadow-[0_4px_30px_rgba(63,46,128,0.08)] backdrop-blur-xl'
        : 'bg-transparent py-5'
    "
  >
    <nav
      class="relative mx-auto flex max-w-[1240px] items-center justify-between px-6 lg:px-10"
      aria-label="Main navigation"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
        aria-label="Soul Solutions home"
        v-motion
        :initial="{ opacity: 0, x: -24 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 100 } }"
      >
        <svg
          viewBox="0 0 48 40"
          class="h-9 w-11 text-plum"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M24 34C14 30 12 18 24 5c12 13 10 25 0 29Z" />
          <path d="M24 34C12 34 5 26 4 16c9 0 16 6 20 18Z" />
          <path d="M24 34c12 0 19-8 20-18-9 0-16 6-20 18Z" />
        </svg>
        <span class="flex flex-col leading-none">
          <span class="font-serif text-[1.7rem] font-semibold text-navy sm:text-[2.1rem]">
            Soul Solutions
          </span>
          <span class="mt-1.5 hidden text-[0.6rem] tracking-[0.28em] text-navy/60 sm:block">
            Heal &nbsp;·&nbsp; Understand &nbsp;·&nbsp; Grow
          </span>
        </span>
      </NuxtLink>

      <!-- Desktop links -->
      <ul class="hidden items-center gap-6 lg:flex xl:gap-9">
        <li
          v-for="(link, i) in links"
          :key="link.label"
          v-motion
          :initial="{ opacity: 0, y: -8 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 350 + i * 110 } }"
        >
          <NuxtLink
            :to="link.to"
            class="group relative inline-block py-1 text-[0.92rem] text-navy/80 transition-colors duration-300 hover:text-navy"
            :class="isActive(link.to) && 'font-medium text-navy'"
          >
            {{ link.label }}
            <span
              class="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full bg-plum transition-transform duration-300 ease-out group-hover:scale-x-100"
              :class="isActive(link.to) ? 'scale-x-100' : 'scale-x-0'"
            />
          </NuxtLink>
        </li>
      </ul>

      <!-- Right side -->
      <div class="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          class="rounded-full p-2 text-navy transition-transform duration-300 hover:scale-110"
          aria-label="Search"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 700, delay: 850 } }"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>

        <NuxtLink
          to="/#contact"
          class="hidden rounded-full bg-plum px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(124,92,196,0.55)] sm:inline-block"
          v-motion
          :initial="{ opacity: 0, y: -8 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 950 } }"
        >
          Book a Session
        </NuxtLink>

        <!-- Hamburger -->
        <button
          type="button"
          class="rounded-full p-2 text-navy lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          @click="open = !open"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="open"
          id="mobile-menu"
          class="absolute inset-x-4 top-full mt-3 rounded-3xl bg-white/90 p-6 shadow-[0_20px_60px_rgba(63,46,128,0.15)] backdrop-blur-xl lg:hidden"
        >
          <ul class="flex flex-col gap-1">
            <li v-for="link in links" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="block rounded-xl px-3 py-3 text-navy transition-colors hover:bg-lavender-soft"
                :class="isActive(link.to) && 'bg-lavender-soft font-medium'"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink
            to="/contact"
            class="mt-4 block rounded-full bg-plum py-3 text-center text-sm font-medium text-white"
          >
            Book a Session
          </NuxtLink>
        </div>
      </Transition>
    </nav>
  </header>
</template>