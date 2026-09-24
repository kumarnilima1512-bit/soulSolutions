<script setup lang="ts">
useSeoMeta({ title: 'Contact | Soul Solutions', description: 'Book a session or send us a message. We are here to listen.' })

const form = reactive({ name: '', email: '', phone: '', mode: 'Online', message: '' })
const sending = ref(false)
const sent = ref(false)


const submit = async () => {
  sending.value = true
  await new Promise((r) => setTimeout(r, 900))
  sending.value = false
  sent.value = true
}

// NOTE: placeholder. Real details will be set lateer.
const info = [
  { label: 'Call us', value: '+91 00000 00000', href: 'tel:+910000000000', bg: 'bg-lavender', icon: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>' },
  { label: 'Email us', value: 'hello@yourdomain.com', href: 'mailto:hello@yourdomain.com', bg: 'bg-peach', icon: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>' },
  { label: 'Visit us', value: 'Your address, Kolkata', href: '', bg: 'bg-mint', icon: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>' },
  { label: 'Hours', value: 'Mon – Sat, 10am – 7pm', href: '', bg: 'bg-sky', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
]

const field = 'mt-2 w-full rounded-2xl border border-plum/15 bg-white/80 px-5 py-3.5 text-[0.95rem] text-navy placeholder:text-navy/35 transition-all duration-300 focus:border-violet focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet/15'
</script>

<template>
  <main>
    <PageHeader
      eyebrow="Contact"
      title="We'd love to"
      accent="hear from you."
      text="Book a session or just say hello. There is no pressure and no judgment, only a real person who will listen."
    />

    <section class="bg-cream px-6 pb-20 lg:px-10 lg:pb-28">
      <div class="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <!-- Info -->
        <div class="space-y-5">
          <component
            :is="c.href ? 'a' : 'div'"
            v-for="c in info"
            :key="c.label"
            :href="c.href || undefined"
            class="group flex items-center gap-5 rounded-[1.75rem] bg-white p-5 shadow-[0_10px_40px_rgba(63,46,128,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(124,92,196,0.18)]"
          >
            <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[45%_55%_50%_50%] text-plum transition-transform duration-500 group-hover:-translate-y-1" :class="c.bg">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon" />
            </span>
            <span>
              <span class="block text-xs uppercase tracking-[0.2em] text-plum/60">{{ c.label }}</span>
              <span class="mt-0.5 block font-medium text-navy">{{ c.value }}</span>
            </span>
          </component>

          <div class="rounded-[1.75rem] bg-lavender-soft p-6 text-sm leading-relaxed text-navy/75">
            <p class="font-medium text-navy">Need urgent help?</p>
            <p class="mt-1">
              If you or someone near you is in immediate danger or crisis, please contact your local
              emergency number or a mental health helpline right away. Our form is not monitored in real time.
            </p>
          </div>
        </div>

        <!-- Form -->
        <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lavender-soft via-white to-peach/40 p-7 shadow-[0_20px_70px_rgba(63,46,128,0.12)] sm:p-10">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-blob-a rounded-full bg-violet/15 blur-3xl max-md:animate-none" aria-hidden="true" />

          <Transition
            mode="out-in"
            enter-active-class="transition duration-700"
            enter-from-class="opacity-0 translate-y-4"
            leave-active-class="transition duration-300"
            leave-to-class="opacity-0"
          >
            <div v-if="sent" class="relative py-16 text-center">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint text-plum">
                <svg viewBox="0 0 24 24" class="h-9 w-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
              </div>
              <h2 class="mt-6 font-serif text-3xl font-semibold text-navy">Thank you, {{ form.name || 'friend' }}.</h2>
              <p class="mx-auto mt-3 max-w-[380px] text-navy/70">We have received your message and will reach out soon. Reaching out was a brave first step.</p>
            </div>

            <form v-else class="relative space-y-5" @submit.prevent="submit">
              <h2 class="font-serif text-3xl font-semibold text-navy">Book a session</h2>

              <div class="grid gap-5 sm:grid-cols-2">
                <label class="block text-sm font-medium text-navy/80">Your name
                  <input v-model="form.name" type="text" required autocomplete="name" placeholder="Your name" :class="field" />
                </label>
                <label class="block text-sm font-medium text-navy/80">Phone (optional)
                  <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+91" :class="field" />
                </label>
              </div>

              <label class="block text-sm font-medium text-navy/80">Email
                <input v-model="form.email" type="email" required autocomplete="email" placeholder="you@example.com" :class="field" />
              </label>

              <fieldset>
                <legend class="text-sm font-medium text-navy/80">Preferred session</legend>
                <div class="mt-2 flex gap-3">
                  <label
                    v-for="m in ['Online', 'In-person']"
                    :key="m"
                    class="cursor-pointer rounded-full border px-5 py-2 text-sm transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet"
                    :class="form.mode === m ? 'border-plum bg-plum text-white' : 'border-plum/20 bg-white text-navy/75 hover:border-violet'"
                  >
                    <input v-model="form.mode" type="radio" name="mode" :value="m" class="sr-only" />
                    {{ m }}
                  </label>
                </div>
              </fieldset>

              <label class="block text-sm font-medium text-navy/80">How can we help?
                <textarea v-model="form.message" rows="4" required placeholder="Share only what you're comfortable with." :class="field" />
              </label>

              <button
                type="submit"
                :disabled="sending"
                class="group inline-flex items-center gap-2 rounded-full bg-plum px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,92,196,0.5)] disabled:opacity-60"
              >
                {{ sending ? 'Sending…' : 'Send message' }}
                <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <p class="text-xs text-navy/50">Your details are kept private and never shared.</p>
            </form>
          </Transition>
        </div>
      </div>
    </section>
  </main>
</template>