// server/api/activities.get.ts
// Reads activity and programme images for the Activity page from a Notion database.
// Every file in the "Image" column becomes its own item, so one row can hold many photos.

interface NotionRichText {
  plain_text: string
}

interface NotionFile {
  name?: string
  file?: { url: string }
  external?: { url: string }
}

export interface ActivityImage {
  id: string
  title: string
  category: string
  url: string
  order: number
}

/* ---------- Property lookup (case-insensitive, ignores extra spaces) ---------- */
const norm = (s: string) => s.trim().toLowerCase()

const getProp = (props: Record<string, any>, ...names: string[]) => {
  for (const name of names) {
    const key = Object.keys(props).find((k) => norm(k) === norm(name))
    if (key) return props[key]
  }
  return undefined
}

const getTitleProp = (props: Record<string, any>) =>
  Object.values(props).find((p: any) => p?.type === 'title')

/* ---------- Property readers ---------- */
const joinText = (parts?: NotionRichText[]) => (parts ?? []).map((t) => t.plain_text).join('')
const readTitle = (p: any) => joinText(p?.title).trim()
const readSelect = (p: any) => (p?.select?.name as string | undefined) ?? ''
const readNumber = (p: any) => (typeof p?.number === 'number' ? (p.number as number) : null)
const readFiles = (p: any): string[] =>
  ((p?.files ?? []) as NotionFile[])
    .map((f) => f.file?.url ?? f.external?.url ?? '')
    .filter(Boolean)

/* ---------- Handler ---------- */
// Notion-hosted file URLs expire after about one hour, so the cache is kept short.
// The cache is bypassed in development so changes in Notion show up right away.
export default defineCachedEventHandler(
  async () => {
    const config = useRuntimeConfig()
    const token = config.notionToken as string
    const databaseId = config.notionActivityDatabaseId as string

    if (!token) {
      throw createError({ statusCode: 500, statusMessage: 'Missing config: notionToken' })
    }
    if (!databaseId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing config: notionActivityDatabaseId (check .env and nuxt.config runtimeConfig, then restart the dev server)',
      })
    }

    const rows: any[] = []
    let cursor: string | undefined

    do {
      const res: any = await $fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: { page_size: 100, start_cursor: cursor },
      }).catch((e: any) => {
        const detail = e?.data?.message || e?.message || 'Unknown error'
        console.error('[activities] Notion error:', detail)
        throw createError({ statusCode: 502, statusMessage: `Notion: ${detail}` })
      })

      rows.push(...res.results)
      cursor = res.has_more ? res.next_cursor : undefined
    } while (cursor)

    const items: ActivityImage[] = rows
      .flatMap((page) => {
        const p = page.properties as Record<string, any>

        // A row is visible unless the Visible checkbox exists and is unticked
        const visibleProp = getProp(p, 'Visible')
        if (visibleProp && visibleProp.checkbox !== true) return []

        const title = readTitle(getProp(p, 'Name', 'Title')) || readTitle(getTitleProp(p))
        const category = readSelect(getProp(p, 'Category', 'Type'))
        const order = readNumber(getProp(p, 'Order')) ?? 9999
        const urls = readFiles(getProp(p, 'Image', 'Images', 'Photo', 'Photos'))

        return urls.map((url, i) => ({
          id: `${page.id}-${i}`,
          title,
          category,
          url,
          order,
        }))
      })
      .sort((a, b) => a.order - b.order)

    if (import.meta.dev) {
      console.log(`[activities] Notion rows: ${rows.length}, images shown: ${items.length}`)
    }

    return items
  },
  {
    name: 'activities',
    maxAge: 60 * 20,
    shouldBypassCache: () => import.meta.dev,
  },
)