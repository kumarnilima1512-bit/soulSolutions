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
    Department?: { select: { name: string } | null }
    Role?: { rich_text: RichText[] }
    Bio?: { rich_text: RichText[] }
    Photo?: { files: NotionFile[] }
    Order?: { number: number | null }
    Availability?: { rich_text: RichText[] }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')

// Parses a Notion text field like:

function parseAvailability(raw: string): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)

  for (const line of lines) {
    const [dayPart, timesPart] = line.split(':')
    if (!dayPart || !timesPart) continue

    const day = dayPart.trim()
    const times = timesPart.split(',').map((t) => t.trim()).filter(Boolean)
    if (times.length > 0) result[day] = times
  }

  return result
}

export default cachedEventHandler(
  async () => {
    const config = useRuntimeConfig()
    const headers = {
      Authorization: `Bearer ${config.notionToken}`,
      'Notion-Version': '2025-09-03',
      'Content-Type': 'application/json',
    }

    try {
      const db = await $fetch<{ data_sources?: { id: string }[] }>(
        `https://api.notion.com/v1/databases/${config.notionDatabaseId}`,
        { headers },
      )
      const dataSourceId = db.data_sources?.[0]?.id
      if (!dataSourceId) throw new Error('No data source found')

      const res = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers,
          body: {
            filter: { property: 'Active', checkbox: { equals: true } },
            sorts: [
              { property: 'Department', direction: 'ascending' },
              { property: 'Order', direction: 'ascending' },
            ],
          },
        },
      )

      return res.results.map((page) => {
        const p = page.properties
        const photo = p.Photo?.files?.[0]
        const rawAvailability = text(p.Availability?.rich_text)

        return {
          id: page.id,
          department: (p.Department?.select?.name ?? '').toLowerCase(),
          name: text(p.Name?.title),
          role: text(p.Role?.rich_text),
          bio: text(p.Bio?.rich_text) || null,
          photo_url: photo?.type === 'file' ? photo.file?.url : (photo?.external?.url ?? null),
          
          availability: parseAvailability(rawAvailability),
        }
      })
    } catch (err) {
      console.error('Notion team fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load team' })
    }
  },
  { maxAge: 60, swr: false },
)