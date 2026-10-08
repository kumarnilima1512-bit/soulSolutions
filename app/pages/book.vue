<script setup lang="ts">
useSeoMeta({
  title: 'Book a Session | Soul Solutions',
  description: 'Choose a doctor, pick an available date and book your session with Soul Solutions.',
})

interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
}

interface Doctor {
  id: string
  department: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  availability: Record<string, string[]>
  fees: { offline: number | null; online: number | null; international: number | null }
}

const { data: services } = await useFetch<Service[]>('/api/services', { default: () => [] })
const { data: doctors } = await useFetch<Doctor[]>('/api/team', { default: () => [] })

/* ---------- Hero animation ---------- */
const heroShown = ref(false)
onMounted(() => setTimeout(() => (heroShown.value = true), 80))

/* ---------- Form state ---------- */
const form = reactive({
  serviceId: '',
  doctorId: '',
  date: '',
  time: '',
  mode: 'Online' as 'Online' | 'In-person',
  name: '',
  email: '',
  phone: '',
  message: '',
})

// Preselect service/doctor when arriving from a service page: /book?service=...&doctor=...
const route = useRoute()
if (typeof route.query.service === 'string') form.serviceId = route.query.service
if (typeof route.query.doctor === 'string' && doctors.value.some((d) => d.id === route.query.doctor)) {
  form.doctorId = route.query.doctor
}

const selectedDoctor = computed(() => doctors.value.find((d) => d.id === form.doctorId) ?? null)

// Reset date/time whenever the doctor changes, since availability differs per doctor.
watch(
  () => form.doctorId,
  () => {
    form.date = ''
    form.time = ''
  },
)
// Reset time whenever the date changes, since each weekday has its own times.
watch(
  () => form.date,
  () => {
    form.time = ''
  },
)

// Only weekdays that appear as keys in this doctor's availability object.
const availableDates = computed(() => {
  if (!selectedDoctor.value) return []
  const availableDays = Object.keys(selectedDoctor.value.availability)
  if (availableDays.length === 0) return []

  const result: { value: string; weekday: string; day: string; month: string }[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
    if (!availableDays.includes(weekday)) continue

    result.push({
      value: d.toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.toLocaleDateString('en-US', { day: 'numeric' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return result
})

// Only the times that belong to the specific weekday of the selected date.
const timeSlotsForDoctor = computed(() => {
  if (!selectedDoctor.value || !form.date) return []
  const weekday = new Date(`${form.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' })
  return selectedDoctor.value.availability[weekday] ?? []
})

/* ---------- Session type + fee ---------- */
const rupee = (n: number | null) => (n == null ? '' : `₹ ${n.toLocaleString('en-IN')}`)

const feeFor = (m: 'Online' | 'In-person') => {
  const f = selectedDoctor.value?.fees
  if (!f) return null
  return m === 'Online' ? f.online : f.offline
}

// If a doctor has fees set but no offline fee, they don't see patients in clinic.
const modeAvailable = (m: 'Online' | 'In-person') => {
  const f = selectedDoctor.value?.fees
  if (!f) return true
  const hasAnyFee = f.online != null || f.offline != null
  return !hasAnyFee || feeFor(m) != null
}

watch(
  () => [form.doctorId, form.mode],
  () => {
    if (!modeAvailable(form.mode)) form.mode = form.mode === 'Online' ? 'In-person' : 'Online'
  },
  { immediate: true },
)

const selectedFee = computed(() => feeFor(form.mode))

const formatDateLabel = (value: string) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

const canSubmit = computed(
  () => !!form.doctorId && !!form.date && !!form.time && !!form.name && !!form.email,
)

const sending = ref(false)
const sent = ref(false)

// NOTE: this only shows a success screen for now — wire this up to a real
// email/calendar/CRM backend so bookings are actually received.
const submit = async () => {
  sending.value = true
  await new Promise((r) => setTimeout(r, 900))
  sending.value = false
  sent.value = true
}

const field = 'mt-2 w-full rounded-2xl border border-plum/15 bg-white/80 px-5 py-3.5 text-[0.95rem] text-navy placeholder:text-navy/35 transition-all duration-300 focus:border-violet focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet/15'

const initials = (name: string) =>
  name.replace(/^(Dr|Ms|Mr|Mrs)\.?\s+/i, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
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

          <!-- ===== Success ===== -->
          <div v-if="sent" class="relative py-10 text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint text-plum">
              <svg viewBox="0 0 24 24" class="h-9 w-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </div>
            <h2 class="mt-6 font-serif text-3xl font-semibold text-navy">Thank you, {{ form.name || 'friend' }}.</h2>
            <p class="mx-auto mt-3 max-w-[440px] text-navy/70">
              Your request to see <strong class="text-plum">{{ selectedDoctor?.name }}</strong> on
              <strong class="text-plum">{{ formatDateLabel(form.date) }} at {{ form.time }}</strong>
              has been received. We'll confirm your exact slot shortly.
            </p>
            <NuxtLink
              to="/"
              class="mt-8 inline-flex items-center gap-2 rounded-full border-[1.5px] border-plum/70 px-7 py-3 text-sm font-medium text-plum transition-all duration-300 hover:bg-lavender-soft"
            >
              Back to home
            </NuxtLink>
          </div>

          <!-- ===== One single form ===== -->
          <form v-else class="relative space-y-10" @submit.prevent="submit">
            <!-- Service (optional) -->
            <div v-if="services.length > 0">
              <label class="text-sm font-medium text-navy/80">
                What do you need support with? <span class="text-navy/40">(optional)</span>
              </label>
              <select v-model="form.serviceId" :class="field">
                <option value="">Not sure yet</option>
                <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <!-- Step: Doctor -->
            <div>
              <h2 class="font-serif text-xl font-semibold text-navy">1. Choose your doctor</h2>

              <div class="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  v-for="d in doctors"
                  :key="d.id"
                  type="button"
                  class="group flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all duration-300 sm:flex-row sm:items-center sm:gap-3 sm:p-4 sm:text-left"
                  :class="form.doctorId === d.id
                    ? 'border-plum bg-lavender-soft shadow-[0_8px_24px_rgba(30,77,70,0.15)]'
                    : 'border-plum/15 hover:border-violet/50 hover:bg-lavender-soft/50'"
                  @click="form.doctorId = d.id"
                >
                  <span class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-lavender-soft sm:h-12 sm:w-12">
                    <img v-if="d.photo_url" :src="d.photo_url" :alt="d.name" class="h-full w-full object-cover" />
                    <span v-else class="flex h-full w-full items-center justify-center font-serif text-xs font-semibold text-plum sm:text-sm">
                      {{ initials(d.name) }}
                    </span>
                  </span>
                  <span>
                    <span class="block text-sm font-medium leading-snug text-navy sm:text-base">{{ d.name }}</span>
                    <span class="mt-0.5 block text-[0.7rem] text-navy/60 sm:text-xs">{{ d.role }}</span>
                  </span>
                </button>

                <p v-if="doctors.length === 0" class="col-span-2 text-sm text-navy/50">
                  Our team's availability is being set up. Please share your preferred details in the message box below.
                </p>
              </div>
            </div>

            <!-- Step: Date (only this doctor's available weekdays) -->
            <div v-if="form.doctorId">
              <h2 class="font-serif text-xl font-semibold text-navy">2. Pick an available date</h2>

              <p v-if="availableDates.length === 0" class="mt-3 text-sm text-navy/50">
                {{ selectedDoctor?.name }}'s availability isn't set up yet. Please mention a preferred date in the message box, and we'll confirm by phone or email.
              </p>

              <div v-else class="mt-4 flex gap-2.5 overflow-x-auto pb-2">
                <button
                  v-for="d in availableDates"
                  :key="d.value"
                  type="button"
                  class="flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-all duration-300"
                  :class="form.date === d.value
                    ? 'border-plum bg-plum text-white'
                    : 'border-plum/15 text-navy/75 hover:border-violet hover:bg-lavender-soft'"
                  @click="form.date = d.value"
                >
                  <span class="text-[0.65rem] uppercase tracking-wide opacity-70">{{ d.weekday }}</span>
                  <span class="mt-1 font-serif text-lg font-semibold">{{ d.day }}</span>
                  <span class="text-[0.65rem] opacity-70">{{ d.month }}</span>
                </button>
              </div>
            </div>

            <!-- Step: Time (only times that belong to this exact weekday) -->
            <div v-if="form.date">
              <h2 class="font-serif text-xl font-semibold text-navy">3. Pick a time</h2>
              <p class="mt-1 text-sm text-navy/60">{{ formatDateLabel(form.date) }}</p>

              <div v-if="timeSlotsForDoctor.length === 0" class="mt-3 text-sm text-navy/50">
                No time slots are set for this day yet. Please mention a preferred time in the message box below.
              </div>

              <div v-else class="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                <button
                  v-for="t in timeSlotsForDoctor"
                  :key="t"
                  type="button"
                  class="rounded-xl border px-2 py-2.5 text-sm transition-all duration-300"
                  :class="form.time === t
                    ? 'border-plum bg-plum text-white'
                    : 'border-plum/15 text-navy/75 hover:border-violet hover:bg-lavender-soft'"
                  @click="form.time = t"
                >
                  {{ t }}
                </button>
              </div>

              <fieldset class="mt-5">
                <legend class="text-sm font-medium text-navy/80">Session type</legend>
                <div class="mt-2 flex flex-wrap gap-3">
                  <label
                    v-for="m in (['Online', 'In-person'] as const)"
                    :key="m"
                    class="rounded-full border px-5 py-2.5 text-sm transition-all duration-300"
                    :class="[
                      !modeAvailable(m)
                        ? 'cursor-not-allowed border-plum/10 bg-white text-navy/30'
                        : form.mode === m
                          ? 'cursor-pointer border-plum bg-plum text-white'
                          : 'cursor-pointer border-plum/20 bg-white text-navy/75 hover:border-violet',
                    ]"
                  >
                    <input v-model="form.mode" type="radio" name="mode" :value="m" :disabled="!modeAvailable(m)" class="sr-only" />
                    {{ m }}<span v-if="feeFor(m) != null" class="ml-1.5 opacity-80">· {{ rupee(feeFor(m)) }}</span>
                  </label>
                </div>
                <p v-if="selectedFee != null" class="mt-3 text-xs text-navy/55">
                  Consultation fee: <strong class="text-plum">{{ rupee(selectedFee) }}</strong>. Advance payment is required to confirm your slot.
                </p>
              </fieldset>
            </div>

            <!-- Step: Details -->
            <div v-if="form.time || (form.date && timeSlotsForDoctor.length === 0)">
              <h2 class="font-serif text-xl font-semibold text-navy">4. Your details</h2>

              <div class="mt-4 grid gap-5 sm:grid-cols-2">
                <label class="block text-sm font-medium text-navy/80">Your name
                  <input v-model="form.name" type="text" required autocomplete="name" placeholder="Your name" :class="field" />
                </label>
                <label class="block text-sm font-medium text-navy/80">Phone (optional)
                  <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+91" :class="field" />
                </label>
              </div>

              <label class="mt-5 block text-sm font-medium text-navy/80">Email
                <input v-model="form.email" type="email" required autocomplete="email" placeholder="you@example.com" :class="field" />
              </label>

              <label class="mt-5 block text-sm font-medium text-navy/80">Anything you'd like us to know? (optional)
                <textarea v-model="form.message" rows="3" placeholder="Share only what you're comfortable with." :class="field" />
              </label>
            </div>

            <!-- Submit -->
            <div v-if="form.time" class="flex flex-col items-end gap-3">
              <button
                type="submit"
                :disabled="!canSubmit || sending"
                class="inline-flex items-center gap-2 rounded-full bg-plum px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {{ sending ? 'Sending…' : 'Confirm booking' }}
                <svg v-if="!sending" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <p class="text-xs text-navy/45">Your details are kept private and never shared.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>