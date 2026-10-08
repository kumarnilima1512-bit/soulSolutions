// server/api/about-team.get.ts
// Reads founders and team members for the About page from its own Notion database.
// Property names are matched case-insensitively, and visibility/sorting are done in code,
// so small naming differences in Notion do not break the page.

interface NotionRichText {
  plain_text: string
}

interface NotionFile {
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
  order: number
}

/* ---------- Property lookup (case-insensitive, ignores extra spaces) ---------- */
const norm = (s: string) => s.trim().toLowerCase()

const getProp = (props: Record<string, any>, name: string) => {
  const key = Object.keys(props).find((k) => norm(k) === norm(name))
  return key ? props[key] : undefined
}

// The title property is found by type, so it works whatever the column is called.
const getTitleProp = (props: Record<string, any>) =>
  Object.values(props).find((p: any) => p?.type === 'title')

/* ---------- Property readers ---------- */
const joinText = (parts?: NotionRichText[]) => (parts ?? []).map((t) => t.plain_text).join('')

const readTitle = (p: any) => joinText(p?.title).trim()
const readText = (p: any) => joinText(p?.rich_text).trim()
const readSelect = (p: any) => (p?.select?.name as string | undefined) ?? ''
const readMulti = (p: any) => ((p?.multi_select ?? []) as { name: string }[]).map((o) => o.name)
const readNumber = (p: any) => (typeof p?.number === 'number' ? (p.number as number) : null)

// One item per line (Shift+Enter inside a Notion text cell). Commas also work.
const readList = (p: any) => {
  // Works whether the column is a text cell or a multi-select
  if (p?.type === 'multi_select') return readMulti(p)
  return readText(p)
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean)
}

const readPhoto = (p: any): string | null => {
  const f = (p?.files?.[0] ?? null) as NotionFile | null
  return f?.file?.url ?? f?.external?.url ?? null
}

/* ---------- Handler ---------- */
// Notion-hosted file URLs expire after about one hour, so the cache is kept short.
// The cache is bypassed in development so changes in Notion show up right away.
export default defineCachedEventHandler(
  async () => {
    const config = useRuntimeConfig()
    const token = config.notionToken as string
    const databaseId = config.notionAboutDbId as string

    if (!token) {
      throw createError({ statusCode: 500, statusMessage: 'Missing config: notionToken' })
    }
    if (!databaseId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing config: notionAboutDbId (check .env and nuxt.config runtimeConfig, then restart the dev server)',
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
        console.error('[about-team] Notion error:', detail)
        throw createError({ statusCode: 502, statusMessage: `Notion: ${detail}` })
      })

      rows.push(...res.results)
      cursor = res.has_more ? res.next_cursor : undefined
    } while (cursor)

    const members: TeamMember[] = rows
      .map((page) => {
        const p = page.properties as Record<string, any>

        // Treat a row as visible unless the Visible checkbox exists and is unticked
        const visibleProp = getProp(p, 'Visible')
        const visible = visibleProp ? visibleProp.checkbox === true : true

        const name = readTitle(getProp(p, 'Name')) || readTitle(getTitleProp(p))

        return {
          visible,
          member: {
            id: page.id as string,
            name,
            role: readText(getProp(p, 'Role')),
            department: norm(readSelect(getProp(p, 'Department'))) === 'psychology' ? 'psychology' : 'psychiatry',
            is_founder: norm(readSelect(getProp(p, 'Type'))) === 'founder',
            qualifications: readText(getProp(p, 'Qualifications')),
            experience_years: readNumber(getProp(p, 'Experience')),
            institutions: readList(getProp(p, 'Institutions')),
            specializations: readList(getProp(p, 'Specializations')),
            bio: readText(getProp(p, 'Bio')) || null,
            photo_url: readPhoto(getProp(p, 'Photo')),
            order: readNumber(getProp(p, 'Order')) ?? 9999,
          } satisfies TeamMember,
        }
      })
      .filter((r) => r.visible && r.member.name)
      .map((r) => r.member)
      .sort((a, b) => a.order - b.order)

    if (import.meta.dev) {
      console.log(`[about-team] Notion rows: ${rows.length}, shown: ${members.length}`)
    }

    return members
  },
  {
    name: 'about-team',
    maxAge: 60 * 20,
    shouldBypassCache: () => import.meta.dev,
  },
)