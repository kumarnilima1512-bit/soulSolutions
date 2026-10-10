interface Payload {
  name?: string
  quote?: string
  context?: string
  rating?: number
  consent?: boolean
  website?: string // honeypot: real people leave this empty
}

// Simple in-memory rate limit: 3 submissions per IP per hour.
const hits = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_HITS = 3

export default defineEventHandler(async (event) => {
  const body = await readBody<Payload>(event)

  // Bots fill hidden fields; pretend success and drop it.
  if (body.website) return { ok: true }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    throw createError({ statusCode: 429, statusMessage: 'Too many submissions. Please try again later.' })
  }

  const name = (body.name ?? '').trim().slice(0, 60) || 'Anonymous'
  const quote = (body.quote ?? '').trim()
  const context = (body.context ?? '').trim().slice(0, 80)
  const rating = Number.isInteger(body.rating) && body.rating! >= 1 && body.rating! <= 5 ? body.rating : null

  if (!body.consent) {
    throw createError({ statusCode: 400, statusMessage: 'Please confirm you are happy for us to share your words.' })
  }
  if (quote.length < 20 || quote.length > 800) {
    throw createError({ statusCode: 400, statusMessage: 'Please write between 20 and 800 characters.' })
  }

  const config = useRuntimeConfig()

  try {
    const dataSourceId = await getDataSourceId(config.notionTestimonialsDatabaseId)

    await $fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: notionHeaders(),
      body: {
        parent: { type: 'data_source_id', data_source_id: dataSourceId },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Quote: { rich_text: [{ text: { content: quote } }] },
          ...(context && { Context: { rich_text: [{ text: { content: context } }] } }),
          ...(rating && { Rating: { number: rating } }),
          // Never published until someone ticks Active in Notion.
          Active: { checkbox: false },
          Featured: { checkbox: false },
        },
      },
    })

    hits.set(ip, [...recent, now])
    return { ok: true }
  } catch (err) {
    console.error('Testimonial submit failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Could not submit your review right now.' })
  }
})