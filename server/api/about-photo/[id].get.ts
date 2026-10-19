// Serves a team member's photo through our own server, so the page never
// depends on Notion's short-lived (about 1 hour) file links.

const cache = new Map<string, { buf: Uint8Array; type: string; exp: number }>()
const TTL = 6 * 60 * 60 * 1000 // keep the picture in memory for 6 hours

const stripDashes = (s: string) => s.replace(/-/g, '').toLowerCase()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  }

  // ?v= changes when the row is edited in Notion, so a new photo is fetched fresh
  const version = String(getQuery(event).v ?? '')
  const cacheKey = `${id}:${version}`

  const hit = cache.get(cacheKey)
  if (hit && hit.exp > Date.now()) {
    setHeader(event, 'Content-Type', hit.type)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return hit.buf
  }

  const config = useRuntimeConfig()

  try {
    const page: any = await $fetch(`https://api.notion.com/v1/pages/${id}`, {
      headers: {
        Authorization: `Bearer ${config.notionToken}`,
        'Notion-Version': '2022-06-28',
      },
    })

    // Only serve photos that belong to the About database.
    const parent = stripDashes(page?.parent?.database_id ?? '')
    if (parent !== stripDashes(String(config.notionAboutDbId))) {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }

    const props = page.properties as Record<string, any>
    const key = Object.keys(props).find((k) => k.trim().toLowerCase() === 'photo')
    const f = key ? props[key]?.files?.[0] : null
    const url: string | undefined = f?.file?.url ?? f?.external?.url
    if (!url) throw createError({ statusCode: 404, statusMessage: 'No photo' })

    const res = await fetch(url)
    if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Could not load photo' })

    const buf = new Uint8Array(await res.arrayBuffer())
    const type = res.headers.get('content-type') ?? 'image/jpeg'

    cache.set(cacheKey, { buf, type, exp: Date.now() + TTL })

    setHeader(event, 'Content-Type', type)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return buf
  } catch (err: any) {
    // Notion failed: serve the last good copy of this picture if we have one
    if (hit) {
      setHeader(event, 'Content-Type', hit.type)
      setHeader(event, 'Cache-Control', 'public, max-age=300')
      return hit.buf
    }

    if (err?.statusCode) throw err
    console.error('[about-photo]', err?.data?.message || err?.message || err)
    throw createError({ statusCode: 502, statusMessage: 'Could not load photo' })
  }
})