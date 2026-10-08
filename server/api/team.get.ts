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
    OfflineFee?: { number: number | null }
    OnlineFee?: { number: number | null }
    InternationalFee?: { number: number | null }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')

//   -> { Monday: ["7:00 PM"], Wednesday: ["10:00 AM", "11:00 AM"] }
// Splits only at the FIRST colon, so the colon inside "7:00 PM" is safe.
function parseAvailability(raw: string): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const line of raw.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const day = line.slice(0, idx).trim()
    const times = line
      .slice(idx + 1)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (day && times.length > 0) result[day] = times
  }
  return result
}

export default cachedEventHandler(
  async () => {
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionDatabaseId)

      const res = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers: notionHeaders(),
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

        return {
          id: page.id,
          department: (p.Department?.select?.name ?? '').toLowerCase(),
          name: text(p.Name?.title),
          role: text(p.Role?.rich_text),
          bio: text(p.Bio?.rich_text) || null,
          photo_url: photo?.type === 'file' ? photo.file?.url : (photo?.external?.url ?? null),
          availability: parseAvailability(text(p.Availability?.rich_text)),
          fees: {
            offline: p.OfflineFee?.number ?? null,
            online: p.OnlineFee?.number ?? null,
            international: p.InternationalFee?.number ?? null,
          },
        }
      })
    } catch (err) {
      console.error('Notion team fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load team' })
    }
  },
  { maxAge: 60, swr: false },
)