interface RichText { plain_text: string }
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionPage {
  id: string
  properties: {
    Caption?: { title: RichText[] }
    Image?: { files: NotionFile[] }
    Order?: { number: number | null }
    Active?: { checkbox: boolean }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')

// Notion "Files & media" property can hold an uploaded file OR a pasted external link.
const rawFileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

// Some pasted links (like Google Images "imgres" result pages) are not the
// image itself, but they carry the real image URL inside their own query
// string. This pulls that real URL out when possible, otherwise returns
// the link unchanged.
const resolveImageUrl = (url: string | null): string | null => {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Google Images share/result links: .../imgres?...&imgurl=<real image>&...
    if (parsed.hostname.includes('google.') && parsed.pathname.includes('imgres')) {
      const real = parsed.searchParams.get('imgurl')
      if (real) return decodeURIComponent(real)
    }

    // Bing Images share links: .../images/search?...&mediaurl=<real image>&...
    if (parsed.hostname.includes('bing.') && parsed.searchParams.has('mediaurl')) {
      const real = parsed.searchParams.get('mediaurl')
      if (real) return decodeURIComponent(real)
    }

    return url
  } catch {
    return url
  }
}

export default cachedEventHandler(
  async () => {
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionGalleryDatabaseId)

      const res = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers: notionHeaders(),
          body: {
            filter: { property: 'Active', checkbox: { equals: true } },
            sorts: [{ property: 'Order', direction: 'ascending' }],
          },
        },
      )

      return res.results
        .map((page) => ({
          id: page.id,
          src: resolveImageUrl(rawFileUrl(page.properties.Image?.files?.[0])),
          caption: text(page.properties.Caption?.title),
        }))
        .filter((item) => item.src)
    } catch (err) {
      console.error('Notion gallery fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load gallery' })
    }
  },
  { maxAge: 60, swr: false },
)