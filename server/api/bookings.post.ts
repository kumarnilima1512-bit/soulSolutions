interface Body {
  serviceId?: string
  doctorId?: string
  date?: string
  time?: string
  mode?: string
  name?: string
  email?: string
  phone?: string
  message?: string
  website?: string // honeypot: real people leave this empty
}

interface TeamMember {
  id: string
  name: string
  availability: Record<string, string[]>
  fees: { offline: number | null; online: number | null; international: number | null }
}

const rich = (s: string) => (s ? [{ text: { content: s.slice(0, 1900) } }] : [])
const bad = (msg: string) => createError({ statusCode: 400, statusMessage: msg })

// Simple in-memory limit: 5 bookings per IP per hour.
const hits = new Map<string, number[]>()

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const config = useRuntimeConfig()

  // Bots fill hidden fields; pretend success and drop it.
  if (body.website) return { ok: true }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000)
  if (recent.length >= 5) {
    throw createError({ statusCode: 429, statusMessage: 'Too many bookings from this device. Please try again later.' })
  }

  const name = (body.name ?? '').trim().slice(0, 80)
  const email = (body.email ?? '').trim().slice(0, 120)
  const phone = (body.phone ?? '').trim().slice(0, 30)
  const message = (body.message ?? '').trim().slice(0, 1000)
  const time = (body.time ?? '').trim()
  const mode = body.mode

  if (!name) throw bad('Please enter your name.')
  if (!/^\S+@\S+\.\S+$/.test(email)) throw bad('Please enter a valid email.')
  if (mode !== 'Online' && mode !== 'In-person') throw bad('Invalid session type.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date ?? '')) throw bad('Invalid date.')

  // Date must be inside the booking window (a day of slack for timezones).
  const [y, m, d] = body.date!.split('-').map(Number)
  const dateObj = new Date(y!, m! - 1, d!)
  const diffDays = Math.round((dateObj.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000)
  if (diffDays < -1 || diffDays > 31) throw bad('That date is not available.')

  // Re-check against the real Team data, never trust the browser.
  const team = await $fetch<TeamMember[]>('/api/team')
  const doctor = team.find((t) => t.id === body.doctorId)
  if (!doctor) throw bad('Please choose a doctor.')

  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  if (!(doctor.availability[weekday] ?? []).includes(time)) {
    throw bad('That time slot is not available.')
  }

  const hasAnyFee = doctor.fees.online != null || doctor.fees.offline != null
  const modeFee = mode === 'Online' ? doctor.fees.online : doctor.fees.offline
  if (hasAnyFee && modeFee == null) throw bad(`${doctor.name} does not offer ${mode} sessions.`)

  let serviceName = ''
  if (body.serviceId) {
    const services = await $fetch<{ id: string; name: string }[]>('/api/services')
    serviceName = services.find((s) => s.id === body.serviceId)?.name ?? ''
  }

  try {
    const dataSourceId = await getDataSourceId(config.notionBookingsDatabaseId)

    await $fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: notionHeaders(),
      body: {
        parent: { type: 'data_source_id', data_source_id: dataSourceId },
        properties: {
          Name: { title: rich(name) },
          Doctor: { rich_text: rich(doctor.name) },
          ...(serviceName && { Service: { rich_text: rich(serviceName) } }),
          Date: { date: { start: body.date } },
          Time: { rich_text: rich(time) },
          Mode: { select: { name: mode } },
          ...(phone && { Phone: { rich_text: rich(phone) } }),
          Email: { email },
          ...(message && { Message: { rich_text: rich(message) } }),
          Status: { select: { name: 'New' } },
        },
      },
    })

    hits.set(ip, [...recent, now])
    return { ok: true }
  } catch (err) {
    console.error('Booking save failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Could not save your booking right now. Please call us.' })
  }
})