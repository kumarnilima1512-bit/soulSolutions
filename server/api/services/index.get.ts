import { getServiceImage } from '../../utils/serviceImage'
interface RichText { plain_text: string }
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionPage {
  id: string
  last_edited_time: string
  properties: {
    Name?: { title: RichText[] }
    Slug?: { rich_text: RichText[] }
    ShortDescription?: { rich_text: RichText[] }
    Image?: { files: NotionFile[] }
    Consultants?: { rich_text: RichText[] }
    Order?: { number: number | null }
    Active?: { checkbox: boolean }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')
const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

export default cachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionServicesDatabaseId)

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

      // Pre-generate every image so the first visitor never waits for Notion
      const warmUp = Promise.all(
        res.results.map((page) =>
          getServiceImage(page.id, 640, page.last_edited_time).catch(() => null),
        ),
      )
      event.waitUntil(warmUp)

      return res.results.map((page) => {
        const p = page.properties
        return {
          id: page.id,
          slug: text(p.Slug?.rich_text),
          name: text(p.Name?.title),
          shortDescription: text(p.ShortDescription?.rich_text),
          image: fileUrl(p.Image?.files?.[0])
            ? `/api/service-image/${page.id}?w=640&v=${encodeURIComponent(page.last_edited_time)}`
            : null,
          // Names typed in the Consultants column
          consultants: text(p.Consultants?.rich_text)
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
        }
      })
    } catch (err) {
      console.error('Notion services list fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load services' })
    }
  },
  { maxAge: 60, swr: false },
)