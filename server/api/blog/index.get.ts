interface RichText { plain_text: string }
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionPage {
  id: string
  properties: {
    Title?: { title: RichText[] }
    Slug?: { rich_text: RichText[] }
    Excerpt?: { rich_text: RichText[] }
    Cover?: { files: NotionFile[] }
    Category?: { select: { name: string } | null }
    Author?: { rich_text: RichText[] }
    Date?: { date: { start: string } | null }
    Featured?: { checkbox: boolean }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')
const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

export default cachedEventHandler(
  async () => {
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionBlogDatabaseId)

      const res = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers: notionHeaders(),
          body: {
            filter: { property: 'Published', checkbox: { equals: true } },
            sorts: [{ property: 'Date', direction: 'descending' }],
          },
        },
      )

      return res.results.map((page) => {
        const p = page.properties
        return {
          id: page.id,
          slug: text(p.Slug?.rich_text),
          title: text(p.Title?.title),
          excerpt: text(p.Excerpt?.rich_text),
          cover: fileUrl(p.Cover?.files?.[0]),
          category: p.Category?.select?.name ?? 'General',
          author: text(p.Author?.rich_text) || 'Soul Solutions Team',
          date: p.Date?.date?.start ?? null,
          featured: p.Featured?.checkbox ?? false,
        }
      })
    } catch (err) {
      console.error('Notion blog list fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load blog posts' })
    }
  },
  { maxAge: 60 * 10, swr: false },
)