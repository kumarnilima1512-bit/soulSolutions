interface RichText { plain_text: string }
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionPage {
  id: string
  properties: Record<string, any>
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')
const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

// Finds a property by name, ignoring case and spaces, so small naming
// differences (e.g. "VideoURL" vs "Video URL" vs "videourl") still match.
const findProperty = (properties: Record<string, any>, targetName: string) => {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '')
  const target = normalize(targetName)
  const key = Object.keys(properties).find((k) => normalize(k) === target)
  return key ? properties[key] : undefined
}

// Extracts a usable URL string no matter which Notion property shape it came in:
// - URL property:        { type: 'url', url: 'https://...' }
// - Text property:       { type: 'rich_text', rich_text: [{ plain_text: '...' }] }
// - Rare edge cases:      { url: null } or missing entirely
const extractUrl = (prop: any): string => {
  if (!prop) return ''
  if (typeof prop.url === 'string') return prop.url
  if (Array.isArray(prop.rich_text)) return text(prop.rich_text)
  return ''
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  let dataSourceId: string
  try {
    dataSourceId = await getDataSourceId(config.notionVideosDatabaseId)
  } catch (err: any) {
    console.error('[videos] Failed to resolve data source:', err?.data ?? err?.message ?? err)
    return {
      ok: false,
      step: 'getDataSourceId',
      error: err?.data ?? err?.message ?? String(err),
    }
  }

  let results: NotionPage[]
  try {
    const res = await $fetch<{ results: NotionPage[] }>(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: 'POST',
        headers: notionHeaders(),
        body: {},
      },
    )
    results = res.results
  } catch (err: any) {
    console.error('[videos] Failed to query data source:', err?.data ?? err?.message ?? err)
    return {
      ok: false,
      step: 'queryDataSource',
      error: err?.data ?? err?.message ?? String(err),
    }
  }

  // Print the raw shape of the first row to the server terminal, so it can
  // be inspected directly without relying on the JSON response.
  if (results[0]) {
    console.log('[videos] Sample row properties:', JSON.stringify(results[0].properties, null, 2))
  }

  const mapped = await Promise.all(
    results.map(async (page) => {
      const p = page.properties

      const titleProp = findProperty(p, 'Title')
      const descProp = findProperty(p, 'Description')
      const tagProp = findProperty(p, 'Tag')
      const urlProp = findProperty(p, 'VideoURL')
      const posterProp = findProperty(p, 'Poster')
      const activeProp = findProperty(p, 'Active')
      const orderProp = findProperty(p, 'Order')

      const rawUrl = extractUrl(urlProp)
      const active = activeProp?.checkbox ?? false
      const embed = detectVideoEmbed(rawUrl)

      let embedHtml: string | null = null
      if (embed.platform === 'twitter' && rawUrl) {
        embedHtml = await fetchTwitterEmbedHtml(rawUrl)
      }

      return {
        id: page.id,
        title: text(titleProp?.title),
        description: text(descProp?.rich_text),
        tag: text(tagProp?.rich_text),
        url: rawUrl,
        active,
        order: orderProp?.number ?? 0,
        platform: embed.platform,
        embedUrl: embed.embedUrl,
        embedHtml,
        poster: fileUrl(posterProp?.files?.[0]) ?? embed.autoThumbnail,
      }
    }),
  )

  const active = mapped
    .filter((v) => v.active && v.url)
    .sort((a, b) => a.order - b.order)

  return {
    ok: true,
    totalRowsFromNotion: results.length,
    activeAndValidCount: active.length,
    videos: active,
  }
})