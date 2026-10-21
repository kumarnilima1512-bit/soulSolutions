<script setup lang="ts">
const props = withDefaults(defineProps<{
  heading?: string
  text?: string
  endpoint?: string
}>(), {
  heading: 'Confused about something?',
  text: 'Send us your query and we will get back to you by email.',
  endpoint: '/api/query',
})

const form = reactive({ name: '', email: '', query: '', website: '' }) // website = honeypot
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMsg = ref('')

const emailOk = computed(() => /^\S+@\S+\.\S+$/.test(form.email))
const canSubmit = computed(
  () => form.name.trim().length > 1 && emailOk.value && form.query.trim().length > 5 && status.value !== 'sending',
)

async function submit() {
  if (!canSubmit.value) return
  status.value = 'sending'
  errorMsg.value = ''
  try {
    await $fetch(props.endpoint, {
      method: 'POST',
      body: { name: form.name, email: form.email, query: form.query, website: form.website },
    })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.query = ''
  } catch (e: any) {
    status.value = 'error'
    errorMsg.value = e?.data?.statusMessage || 'Something went wrong. Please try again or email us directly.'
  }
}
</script>

<template>
  <div class="rounded-[1.25rem] bg-white p-5 shadow-[0_10px_40px_rgba(30,77,70,0.07)] sm:rounded-[1.75rem] sm:p-6">
    <p class="text-[0.65rem] uppercase tracking-[0.2em] text-plum/60 sm:text-xs">Quick query</p>
    <h3 class="mt-1 text-lg font-medium text-navy sm:text-xl">{{ heading }}</h3>
    <p class="mt-1 text-[0.85rem] leading-relaxed text-navy/65 sm:text-sm">{{ text }}</p>

    <div v-if="status === 'success'" class="mt-4 rounded-2xl bg-mint p-4 text-sm text-navy" role="status">
      Thank you. Your query has been sent and we will reply to you soon.
      <button type="button" class="mt-2 block font-medium text-plum underline-offset-4 hover:underline" @click="status = 'idle'">
        Send another query
      </button>
    </div>

    <form v-else class="mt-4 grid gap-3" novalidate @submit.prevent="submit">
      <input
        v-model="form.name"
        type="text"
        placeholder="Your name"
        autocomplete="name"
        required
        class="w-full rounded-xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:border-plum/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
      >
      <input
        v-model="form.email"
        type="email"
        placeholder="Your email"
        autocomplete="email"
        required
        class="w-full rounded-xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:border-plum/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
      >
      <textarea
        v-model="form.query"
        rows="4"
        placeholder="What are you confused about?"
        required
        class="w-full resize-none rounded-xl border border-navy/10 bg-cream px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:border-plum/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
      />

      <!-- Honeypot: hidden from humans, bots fill it -->
      <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

      <p v-if="status === 'error'" class="text-sm text-red-600" role="alert">{{ errorMsg }}</p>

      <button
        type="submit"
        :disabled="!canSubmit"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-plum/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ status === 'sending' ? 'Sending...' : 'Send query' }}
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </form>
  </div>
</template>