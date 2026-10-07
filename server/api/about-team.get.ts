// server/api/about-team.get.ts
// Reads founders and team members for the About page from its own Notion database.
// Returns one flat list; the pages split it using the `is_founder` flag.

interface NotionRichText {
  plain_text: string
}

interface NotionFile {
  url?: string
  file?: { url: string }
  external?: { url: string }
}

export interface TeamMember {
  id: string
  name: string
  role: string
  department: 'psychiatry' | 'psychology'
  is_founder: boolean
  qualifications: string
  experience_years: number | null
  institutions: string[]
  specializations: string[]
  bio: string | null
  photo_url: string | null
}

/* ---------- Property readers (all safe against missing values) ---------- */
const joinText = (parts?: NotionRichText[]) => (parts ?? []).map((t) => t.plain_text).join('')

const readTitle = (p: any) => joinText(p?.title).trim()
const readText = (p: any) => joinText(p?.rich_text).trim()
const readSelect = (p: any) => (p?.select?.name as string | undefined) ?? ''
const readMulti = (p: any) => ((p?.multi_select ?? []) as { name: string }[]).map((o) => o.name)
const readNumber = (p: any) => (typeof p?.number === 'number' ? (p.number as number) : null)

// One item per line (use Shift+Enter inside a Notion text cell)
const readLines = (p: any) =>
  readText(p)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

const readPhoto = (p: any): string | null => {
  const f = (p?.files?.[0] ?? null) as NotionFile | null
  if (!f) return null
  return f.file?.url ?? f.external?.url ?? null
}

/* ---------- Handler ---------- */
// Notion-hosted file URLs expire after about one hour,
// so the cache lifetime is kept well below that.
export default defineCachedEventHandler(
  async () => {
    const config = useRuntimeConfig()
    const token = config.notionToken as string
    const databaseId = config.notionAboutDbId as string

    if (!token || !databaseId) {
      throw createError({ statusCode: 500, statusMessage: 'About database is not configured' })
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
        body: {
          page_size: 100,
          start_cursor: cursor,
          filter: { property: 'Visible', checkbox: { equals: true } },
          sorts: [{ property: 'Order', direction: 'ascending' }],
        },
      }).catch(() => {
        throw createError({ statusCode: 502, statusMessage: 'Could not reach Notion' })
      })

      rows.push(...res.results)
      cursor = res.has_more ? res.next_cursor : undefined
    } while (cursor)

    const members: TeamMember[] = rows
      .map((page) => {
        const p = page.properties
        const name = readTitle(p.Name)
        return {
          id: page.id as string,
          name,
          role: readText(p.Role),
          department: readSelect(p.Department).toLowerCase() === 'psychology' ? 'psychology' : 'psychiatry',
          is_founder: readSelect(p.Type).toLowerCase() === 'founder',
          qualifications: readText(p.Qualifications),
          experience_years: readNumber(p.Experience),
          institutions: readLines(p.Institutions),
          specializations: readMulti(p.Specializations),
          bio: readText(p.Bio) || null,
          photo_url: readPhoto(p.Photo),
        } satisfies TeamMember
      })
      .filter((m) => m.name)

    return members
  },
  { name: 'about-team', maxAge: 60 * 20 },
)