<script setup lang="ts">
withDefaults(defineProps<{ heading?: string }>(), { heading: '' })

interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
  consultants: string[] // lowercased names from the Services "Consultants" column
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

/* ---------- Safe date helpers ---------- */
const pad = (n: number) => String(n).padStart(2, '0')
const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const parseISODate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}
const weekdayOf = (s: string) =>
  parseISODate(s).toLocaleDateString('en-US', { weekday: 'long' })

const now = ref<Date | null>(null)
onMounted(() => {
  now.value = new Date()
})

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

/* ---------- Service decides which experts are shown ----------
   Uses the same "Consultants" column the service page already uses.
   No service chosen, or an empty Consultants column -> everyone is shown. */
const selectedService = computed(() => services.value.find((s) => s.id === form.serviceId) ?? null)

const doctorMatchesService = (d: Doctor, s: Service | null) => {
  if (!s || s.consultants.length === 0) return true
  const name = d.name.toLowerCase()
  return s.consultants.some((w) => name.includes(w))
}

const filteredDoctors = computed(() =>
  doctors.value.filter((d) => doctorMatchesService(d, selectedService.value)),
)

const filterHint = computed(() =>
  selectedService.value && selectedService.value.consultants.length > 0
    ? `Showing experts for ${selectedService.value.name}.`
    : '',
)

// Preselect when arriving from a service page: ?service=...&doctor=...
const route = useRoute()
if (typeof route.query.service === 'string') form.serviceId = route.query.service
if (typeof route.query.doctor === 'string' && doctors.value.some((d) => d.id === route.query.doctor)) {
  form.doctorId = route.query.doctor
}
// Drop a preselected doctor who isn't listed for the preselected service.
if (form.doctorId && !filteredDoctors.value.some((d) => d.id === form.doctorId)) {
  form.doctorId = ''
}

// Changing the service can hide the doctor already chosen, so clear it then.
watch(
  () => form.serviceId,
  () => {
    if (form.doctorId && !filteredDoctors.value.some((d) => d.id === form.doctorId)) {
      form.doctorId = ''
    }
  },
)

const selectedDoctor = computed(() => doctors.value.find((d) => d.id === form.doctorId) ?? null)

watch(
  () => form.doctorId,
  () => {
    form.date = ''
    form.time = ''
  },
)
watch(
  () => form.date,
  () => {
    form.time = ''
  },
)

const availableDates = computed(() => {
  if (!selectedDoctor.value || !now.value) return []
  const availableDays = Object.keys(selectedDoctor.value.availability)
  if (availableDays.length === 0) return []

  const result: { value: string; weekday: string; day: string; month: string }[] = []

  for (let i = 0; i < 30; i++) {
    const d = new Date(now.value)
    d.setDate(now.value.getDate() + i)
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
    if (!availableDays.includes(weekday)) continue

    result.push({
      value: toISODate(d),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: String(d.getDate()),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return result
})

const timeSlotsForDoctor = computed(() => {
  if (!selectedDoctor.value || !form.date) return []
  return selectedDoctor.value.availability[weekdayOf(form.date)] ?? []
})

/* ---------- Session type + fee ---------- */
const rupee = (n: number | null) => (n == null ? '' : `₹ ${n.toLocaleString('en-IN')}`)

const feeFor = (m: 'Online' | 'In-person') => {
  const f = selectedDoctor.value?.fees
  if (!f) return null
  return m === 'Online' ? f.online : f.offline
}

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
    ? parseISODate(value).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

const canSubmit = computed(
  () => !!form.doctorId && !!form.date && !!form.time && !!form.name && !!form.email,
)

const sending = ref(false)
const sent = ref(false)

// NOTE: this only shows a success screen for now. Wire it to a real
// email/calendar backend so bookings are actually received.
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
  <div>
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
      <h2 v-if="heading" class="font-serif text-3xl font-semibold text-navy">{{ heading }}</h2>

      <!-- Service: decides which experts are shown below -->
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
        <h3 class="font-serif text-xl font-semibold text-navy">1. Choose your doctor</h3>
        <p v-if="filterHint" class="mt-1 text-sm text-plum/80">{{ filterHint }}</p>

        <div class="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            v-for="d in filteredDoctors"
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
            Our team's availability is being set up. Please call us and we'll help you book.
          </p>
          <p v-else-if="filteredDoctors.length === 0" class="col-span-2 text-sm text-navy/50">
            No experts are listed for this service right now. Please call us and we'll help you book.
          </p>
        </div>
      </div>

      <!-- Step: Date -->
      <div v-if="form.doctorId">
        <h3 class="font-serif text-xl font-semibold text-navy">2. Pick an available date</h3>

        <p v-if="availableDates.length === 0" class="mt-3 text-sm text-navy/50">
          {{ selectedDoctor?.name }}'s availability isn't set up yet. Please call us and we'll confirm a date.
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

      <!-- Step: Time -->
      <div v-if="form.date">
        <h3 class="font-serif text-xl font-semibold text-navy">3. Pick a time</h3>
        <p class="mt-1 text-sm text-navy/60">{{ formatDateLabel(form.date) }}</p>

        <div v-if="timeSlotsForDoctor.length === 0" class="mt-3 text-sm text-navy/50">
          No time slots are set for this day yet. Please call us and we'll confirm a time.
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
        <h3 class="font-serif text-xl font-semibold text-navy">4. Your details</h3>

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
</template>