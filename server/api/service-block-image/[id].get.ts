// Serves pictures that sit INSIDE a service's Notion page (flowcharts, etc.)
const cache = new Map<string, { buf: Uint8Array; type: string; exp: number }>()
const TTL = 6 * 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const cacheKey = `${id}:${String(getQuery(event).v ?? '')}`
  const hit = cache.get(cacheKey)
  if (hit && hit.exp > Date.now()) {
    setHeader(event, 'Content-Type', hit.type)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return hit.buf
  }

  try {
    const block: any = await $fetch(`https://api.notion.com/v1/blocks/${id}`, {
      headers: notionHeaders(),
    })
    if (block?.type !== 'image') throw createError({ statusCode: 404, statusMessage: 'Not an image' })

    const url: string | undefined = block.image?.file?.url ?? block.image?.external?.url
    if (!url) throw createError({ statusCode: 404, statusMessage: 'No image' })

    const res = await fetch(url)
    if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Could not load image' })

    const buf = new Uint8Array(await res.arrayBuffer())
    const type = res.headers.get('content-type') ?? 'image/jpeg'
    cache.set(cacheKey, { buf, type, exp: Date.now() + TTL })

    setHeader(event, 'Content-Type', type)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return buf
  } catch (err: any) {
    // Notion failed: serve the last good copy if we have one
    if (hit) {
      setHeader(event, 'Content-Type', hit.type)
      return hit.buf
    }
    if (err?.statusCode) throw err
    console.error('[service-block-image]', err?.data?.message || err?.message || err)
    throw createError({ statusCode: 502, statusMessage: 'Could not load image' })
  }
})