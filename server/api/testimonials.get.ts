interface RichText { plain_text: string }
interface NotionPage {
  id: string
  properties: {
    Name?: { title: RichText[] }
    Quote?: { rich_text: RichText[] }
    Context?: { rich_text: RichText[] }
    Rating?: { number: number | null }
    Featured?: { checkbox: boolean }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')

export default cachedEventHandler(
  async () => {
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionTestimonialsDatabaseId)

      const res = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers: notionHeaders(),
          body: {
            filter: { property: 'Active', checkbox: { equals: true } },
            sorts: [{ timestamp: 'created_time', direction: 'descending' }],
          },
        },
      )

      return res.results
        .map((page) => {
          const p = page.properties
          return {
            id: page.id,
            name: text(p.Name?.title),
            quote: text(p.Quote?.rich_text),
            context: text(p.Context?.rich_text),
            rating: p.Rating?.number ?? null,
            featured: p.Featured?.checkbox ?? false,
          }
        })
        .filter((t) => t.quote)
    } catch (err) {
      console.error('Notion testimonials fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load testimonials' })
    }
  },
  { maxAge: 60, swr: false },
)