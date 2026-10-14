<script setup lang="ts">
withDefaults(defineProps<{ heading?: string }>(), { heading: '' })

interface Service {
  id: string
  slug: string
  name: string
  shortDescription: string
  consultants: string[]
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
  website: '', // honeypot
})

/* ---------- Service decides which experts are shown ---------- */
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
if (form.doctorId && !filteredDoctors.value.some((d) => d.id === form.doctorId)) {
  form.doctorId = ''
}

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

/* ---------- Way 1: pick a preferred date first ---------- */
const prefDate = ref('')
const dateInput = ref<HTMLInputElement | null>(null)

const minDate = computed(() => (now.value ? toISODate(now.value) : ''))
const maxDate = computed(() => {
  if (!now.value) return ''
  const d = new Date(now.value)
  d.setDate(d.getDate() + 29)
  return toISODate(d)
})

// Opens the calendar when the panel is clicked (showPicker where supported).
const openPicker = () => {
  const el = dateInput.value
  if (!el) return
  try {
    el.showPicker()
  } catch {
    el.focus()
  }
}

const prefWeekday = computed(() => (prefDate.value ? weekdayOf(prefDate.value) : ''))

// Doctors (for the chosen service) who have a schedule on that weekday.
const doctorsOnPrefDate = computed(() => {
  if (!prefDate.value) return []
  return filteredDoctors.value
    .map((d) => ({ doctor: d, times: d.availability[prefWeekday.value] ?? [] }))
    .filter((x) => x.times.length > 0)
})

const clearPrefDate = () => {
  prefDate.value = ''
}

// Choosing a doctor from the date panel sets both the doctor and the date.
const chooseDoctorForDate = async (d: Doctor) => {
  form.doctorId = d.id
  await nextTick() // lets the "doctor changed" reset run first
  form.date = prefDate.value
}

// If a doctor is already chosen and is free on the new preferred date, jump to that date.
watch(prefDate, (v) => {
  if (!v || !selectedDoctor.value) return
  if ((selectedDoctor.value.availability[weekdayOf(v)] ?? []).length > 0) {
    form.date = v
  }
})

/* ---------- Way 2: pick a doctor, then one of their dates ---------- */
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

/* ---------- Submit: saves the booking to Notion ---------- */
const sending = ref(false)
const sent = ref(false)
const submitError = ref('')

const submit = async () => {
  submitError.value = ''
  sending.value = true
  try {
    await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        serviceId: form.serviceId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        mode: form.mode,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        website: form.website,
      },
    })
    sent.value = true
  } catch (err: any) {
    submitError.value =
      err?.data?.statusMessage || 'Something went wrong. Please try again, or call us to book.'
  } finally {
    sending.value = false
  }
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
      <p class="mx-auto mt-3 max-w-[460px] text-navy/70">
        We have received your request to see <strong class="text-plum">{{ selectedDoctor?.name }}</strong> on
        <strong class="text-plum">{{ formatDateLabel(form.date) }} at {{ form.time }}</strong>
        ({{ form.mode }}). Our team will confirm your slot shortly.
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

      <!-- Service: decides which experts are shown -->
      <div v-if="services.length > 0">
        <label class="text-sm font-medium text-navy/80">
          What do you need support with? <span class="text-navy/40">(optional)</span>
        </label>
        <select v-model="form.serviceId" :class="field">
          <option value="">Not sure yet</option>
          <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>

      <!-- Way 1: preferred date first -->
      <div>
        <p class="text-sm font-medium text-navy/80">
          Your preferred date <span class="text-navy/40">(optional)</span>
        </p>

        <div class="relative mt-2">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-2xl border border-plum/15 bg-white/80 px-5 py-3.5 text-left transition-all duration-300 hover:border-violet/50 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/15"
            :aria-label="prefDate ? `Preferred date: ${formatDateLabel(prefDate)}. Change date` : 'Choose a preferred date'"
            @click="openPicker"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender text-plum">
              <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </span>
            <span class="min-w-0 flex-1 text-[0.95rem]" :class="prefDate ? 'font-medium text-navy' : 'text-navy/40'">
              {{ prefDate ? formatDateLabel(prefDate) : 'Select a date from the calendar' }}
            </span>
            <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-plum/60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>

          <!-- Real date input: opens the browser's calendar. Hidden behind the button. -->
          <input
            ref="dateInput"
            v-model="prefDate"
            type="date"
            :min="minDate"
            :max="maxDate"
            tabindex="-1"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          />
        </div>

        <button
          v-if="prefDate"
          type="button"
          class="mt-2 text-xs font-medium text-plum underline-offset-4 hover:underline"
          @click="clearPrefDate"
        >
          Clear date
        </button>

        <!-- Doctors free on that date -->
        <div v-if="prefDate" class="mt-4">
          <p class="text-sm text-navy/70">
            Available on <strong class="text-navy">{{ formatDateLabel(prefDate) }}</strong>
            <span v-if="selectedService && selectedService.consultants.length > 0">
              for {{ selectedService.name }}
            </span>
          </p>

          <div v-if="doctorsOnPrefDate.length > 0" class="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            <button
              v-for="x in doctorsOnPrefDate"
              :key="x.doctor.id"
              type="button"
              class="group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 sm:p-4"
              :class="form.doctorId === x.doctor.id && form.date === prefDate
                ? 'border-plum bg-lavender-soft shadow-[0_8px_24px_rgba(30,77,70,0.15)]'
                : 'border-plum/15 hover:border-violet/50 hover:bg-lavender-soft/50'"
              @click="chooseDoctorForDate(x.doctor)"
            >
              <span class="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-lavender-soft">
                <img v-if="x.doctor.photo_url" :src="x.doctor.photo_url" :alt="x.doctor.name" class="h-full w-full object-cover" />
                <span v-else class="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-plum">
                  {{ initials(x.doctor.name) }}
                </span>
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-medium leading-snug text-navy sm:text-base">{{ x.doctor.name }}</span>
                <span class="mt-0.5 block text-[0.7rem] text-navy/60 sm:text-xs">{{ x.doctor.role }}</span>
                <span class="mt-1 block text-[0.7rem] font-medium leading-snug text-plum sm:text-xs">{{ x.times.join(' · ') }}</span>
              </span>
            </button>
          </div>

          <p v-else class="mt-3 rounded-xl bg-lavender-soft px-4 py-3 text-sm text-navy/70">
            No expert has a schedule on this day yet. Please try another date, or choose a doctor below to see their available days.
          </p>
        </div>
      </div>

      <!-- Way 2: pick the doctor first -->
      <div>
        <h3 class="font-serif text-xl font-semibold text-navy">1. Choose your doctor</h3>
        <p v-if="filterHint" class="mt-1 text-sm text-plum/80">{{ filterHint }}</p>
        <p class="mt-1 text-sm text-navy/55">Or pick a doctor and see all the days they are available.</p>

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
      <div v-if="form.date && form.doctorId">
        <h3 class="font-serif text-xl font-semibold text-navy">3. Pick a time</h3>
        <p class="mt-1 text-sm text-navy/60">{{ formatDateLabel(form.date) }} with {{ selectedDoctor?.name }}</p>

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
            Consultation fee: <strong class="text-plum">{{ rupee(selectedFee) }}</strong>.
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

        <!-- Honeypot: hidden from people, bots fill it -->
        <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>Website <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
        </div>
      </div>

      <!-- Submit -->
      <div v-if="form.time" class="space-y-4">
        <p v-if="submitError" class="rounded-xl bg-blush/40 px-4 py-3 text-sm text-navy" role="alert">{{ submitError }}</p>

        <div class="flex flex-col items-end gap-3">
          <button
            type="submit"
            :disabled="!canSubmit || sending"
            class="inline-flex items-center gap-2 rounded-full bg-plum px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            {{ sending ? 'Booking…' : 'Confirm booking' }}
            <svg v-if="!sending" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <p class="text-xs text-navy/45">Your details are kept private and never shared.</p>
        </div>
      </div>
    </form>
  </div>
</template>