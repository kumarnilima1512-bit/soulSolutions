<script setup lang="ts">
import type { Member } from '~/utils/members'
import { departmentLabel, initials } from '~/utils/members'

const props = defineProps<{
  title: string
  members: Member[]
  tone?: 'white' | 'lavender'
}>()

const emit = defineEmits<{ select: [member: Member] }>()

/* Scroll reveal */
const el = ref<HTMLElement | null>(null)
const shown = ref(false)
useIntersectionObserver(
  el,
  ([entry]) => {
    if (entry?.isIntersecting) shown.value = true
  },
  { threshold: 0.08 },
)

const base = 'transition-all duration-[900ms] ease-out'
const on = 'opacity-100 translate-y-0 blur-0'
const off = 'opacity-0 translate-y-8 blur-[6px]'

const sectionBg = computed(() => (props.tone === 'lavender' ? 'bg-lavender-soft' : 'bg-white'))
const cardBg = computed(() =>
  props.tone === 'lavender' ? 'bg-white' : 'bg-gradient-to-br from-lavender-soft via-white to-[#fff6ee]',
)
</script>

<template>
  <section ref="el" class="px-6 py-16 lg:px-10 lg:py-24" :class="sectionBg">
    <div class="mx-auto max-w-[1240px]">
      <div class="mx-auto max-w-[640px] text-center" :class="[base, shown ? on : off]">
        <h2 class="font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] text-navy">
          {{ title }}
        </h2>
      </div>

      <!-- Mobile: horizontal swipe slider | sm+: grid -->
      <div
        class="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-8 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:grid-cols-3"
      >
        <div
          v-for="(m, i) in members"
          :key="m.id"
          class="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink"
          :class="[base, shown ? on : off]"
          :style="{ transitionDelay: `${150 + i * 140}ms` }"
        >
          <article
            class="group flex h-full flex-col rounded-[1.75rem] p-7 text-center shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(124,92,196,0.2)]"
            :class="cardBg"
          >
            <div class="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-white">
              <img
                v-if="m.photo_url"
                :src="m.photo_url"
                :alt="`Portrait of ${m.name}`"
                loading="lazy"
                class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-violet/40 font-serif text-2xl font-semibold text-plum transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105"
                aria-hidden="true"
              >
                {{ initials(m.name) }}
              </div>
            </div>

            <p v-if="departmentLabel(m.department)" class="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-plum/60">
              {{ departmentLabel(m.department) }}
            </p>
            <h3 class="mt-1 font-serif text-xl font-semibold text-navy">{{ m.name }}</h3>
            <p v-if="m.role" class="mt-1 text-sm text-navy/60">{{ m.role }}</p>
            <p v-if="m.qualifications" class="mt-1 text-[0.8rem] font-medium text-plum">{{ m.qualifications }}</p>

            <ul v-if="m.specializations.length" class="mt-4 flex flex-wrap justify-center gap-1.5">
              <li
                v-for="s in m.specializations.slice(0, 3)"
                :key="s"
                class="rounded-full px-2.5 py-1 text-[0.7rem] text-plum"
                :class="tone === 'lavender' ? 'bg-lavender-soft' : 'bg-white'"
              >
                {{ s }}
              </li>
              <li v-if="m.specializations.length > 3" class="px-1 py-1 text-[0.7rem] text-navy/50">
                +{{ m.specializations.length - 3 }} more
              </li>
            </ul>

            <button
              type="button"
              class="mt-auto pt-5 text-sm font-medium text-plum underline-offset-4 transition-colors hover:text-violet hover:underline"
              @click="emit('select', m)"
            >
              View full profile
            </button>
          </article>
        </div>
      </div>

      <!-- Swipe hint (mobile only) -->
      <p v-if="members.length > 1" class="mt-1 flex items-center justify-center gap-1.5 text-xs text-plum/60 sm:hidden">
        Swipe to see more
        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </p>
    </div>
  </section>
</template>