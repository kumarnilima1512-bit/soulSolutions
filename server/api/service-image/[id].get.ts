import { getServiceImage } from '../../utils/serviceImage'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const query = getQuery(event)
  const width = Math.min(Math.max(Number(query.w) || 640, 200), 1600)
  const version = String(query.v ?? '0')

  try {
    const img = await getServiceImage(id, width, version)
    if (!img) throw createError({ statusCode: 404, statusMessage: 'No image' })

    // The URL changes whenever the page is edited (?v=), so it is safe to cache for a year
    setHeader(event, 'Content-Type', img.contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return Buffer.from(img.data, 'base64')
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('Service image fetch failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Could not load image' })
  }
})