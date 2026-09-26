interface RichText { plain_text: string }
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionPage {
  id: string
  properties: {
    Name?: { title: RichText[] }
    Slug?: { rich_text: RichText[] }
    ShortDescription?: { rich_text: RichText[] }
    Image?: { files: NotionFile[] }
    Order?: { number: number | null }
    Active?: { checkbox: boolean }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')
const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

export default cachedEventHandler(
  async () => {
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

      return res.results.map((page) => {
        const p = page.properties
        return {
          id: page.id,
          slug: text(p.Slug?.rich_text),
          name: text(p.Name?.title),
          shortDescription: text(p.ShortDescription?.rich_text),
          image: fileUrl(p.Image?.files?.[0]),
        }
      })
    } catch (err) {
      console.error('Notion services list fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load services' })
    }
  },
  { maxAge: 60, swr: false },
)