<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'Know About Us', to: '/about' },
  { label: 'Approaches', to: '/approaches' },
  { label: 'Services', to: '/services' },
  { label: 'Activity', to: '/activity' },
  { label: 'Mental Health', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Videos', to: '/videos' },
  { label: 'Contact', to: '/contact' },
]

const route = useRoute()
const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(to + '/')

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
        ? 'bg-cream/80 py-2.5 shadow-[0_4px_30px_rgba(63,46,128,0.08)] backdrop-blur-xl'
        : 'bg-transparent py-4'
    "
  >
    <nav
      class="relative mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8"
      aria-label="Main navigation"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-2.5"
        aria-label="Soul Solutions home"
        v-motion
        :initial="{ opacity: 0, x: -24 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 100 } }"
      >
        <img
          src="/images/logo.png"
          alt="Soul Solutions logo"
          class="h-18 w-auto sm:h-12 xl:h-20"
        />
        <span class="flex flex-col leading-none">
          <span class="font-serif text-[1.35rem] font-semibold text-navy sm:text-[1.6rem] xl:text-[1.8rem]">
            Soul Solutions
          </span>
          <span class="mt-1 hidden text-[0.55rem] tracking-[0.26em] text-navy/60 2xl:block">
            Heal &nbsp;·&nbsp; Understand &nbsp;·&nbsp; Grow
          </span>
        </span>
      </NuxtLink>

      <!-- Desktop links (no overflow clipping) -->
      <div class="hidden min-w-0 xl:flex xl:flex-1 xl:justify-center">
        <ul class="flex items-center gap-5 2xl:gap-8">
          <li
            v-for="(link, i) in links"
            :key="link.label"
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { duration: 600, delay: 250 + i * 70 } }"
            class="shrink-0"
          >
            <NuxtLink
              :to="link.to"
              class="group relative inline-block whitespace-nowrap py-1 text-[0.88rem] text-navy/80 transition-colors duration-300 hover:text-navy 2xl:text-[0.92rem]"
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
      </div>

      <!-- Right side -->
      <div class="flex shrink-0 items-center gap-3">
        <NuxtLink
          to="/book"
          class="hidden whitespace-nowrap rounded-full bg-plum px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(124,92,196,0.55)] sm:inline-block"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 700, delay: 800 } }"
        >
          Book a Session
        </NuxtLink>

        <!-- Hamburger (shows below xl) -->
        <button
          type="button"
          class="rounded-full p-2 text-navy xl:hidden"
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

      <!-- Mobile / tablet menu -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="open"
          id="mobile-menu"
          class="absolute inset-x-4 top-full mt-3 max-h-[80vh] overflow-y-auto rounded-3xl bg-white/95 p-6 shadow-[0_20px_60px_rgba(63,46,128,0.15)] backdrop-blur-xl xl:hidden"
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
            to="/book"
            class="mt-4 block rounded-full bg-plum py-3 text-center text-sm font-medium text-white"
          >
            Book a Session
          </NuxtLink>
        </div>
      </Transition>
    </nav>
  </header>
</template>