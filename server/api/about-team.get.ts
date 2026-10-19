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
  designation: string
  department: 'psychiatry' | 'psychology' | ''
  type: 'founder' | 'mentor' | 'professional'
  qualifications: string
  experience_years: number | null
  institutions: string[]
  specializations: string[]
  bio: string | null
  know_more: string
  photo_url: string | null
  order: number
}

/* ---------- Property lookup (case-insensitive, ignores extra spaces) ---------- */
const norm = (s: string) => s.trim().toLowerCase()

const getProp = (props: Record<string, any>, name: string) => {
  const key = Object.keys(props).find((k) => norm(k) === norm(name))
  return key ? props[key] : undefined
}

// Tries several possible column names, returns the first one that exists.
const getFirstProp = (props: Record<string, any>, names: string[]) => {
  for (const n of names) {
    const v = getProp(props, n)
    if (v) return v
  }
  return undefined
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

const readType = (p: any): TeamMember['type'] => {
  const t = norm(readSelect(p))
  if (t === 'founder') return 'founder'
  if (t === 'mentor') return 'mentor'
  return 'professional' // "Professional", "Team" or empty
}

const readDepartment = (p: any): TeamMember['department'] => {
  const d = norm(readSelect(p))
  if (d === 'psychology') return 'psychology'
  if (d === 'psychiatry') return 'psychiatry'
  return ''
}

// One item per line (Shift+Enter inside a Notion text cell). Semicolons also work.
const readList = (p: any) => {
  // Works whether the column is a text cell or a multi-select
  if (p?.type === 'multi_select') return readMulti(p)
  return readText(p)
    .split(/\n|;/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Reads a column whatever its type is (text, select, multi-select), as one line.
const readFlexible = (p: any): string => {
  if (!p) return ''
  if (p.type === 'multi_select') return readMulti(p).join(', ')
  if (p.type === 'select') return readSelect(p)
  if (p.type === 'title') return readTitle(p)
  return readText(p).replace(/\s*\n+\s*/g, ', ')
}

// Does the row have a photo at all? (the picture itself is served by /api/about-photo)
const hasPhoto = (p: any): boolean => {
  const f = (p?.files?.[0] ?? null) as NotionFile | null
  return !!(f?.file?.url ?? f?.external?.url)
}

/* ---------- Handler ---------- */
// Short cache (30s) so Notion edits show up quickly. Bypassed in development.
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
            designation:
              readFlexible(getFirstProp(p, ['Designation', 'Designations'])) ||
              readText(getProp(p, 'Role')),
            department: readDepartment(getProp(p, 'Department')),
            type: readType(getProp(p, 'Type')),
            qualifications: readFlexible(
              getFirstProp(p, ['Qualifications', 'Qualification', 'Degrees', 'Degree']),
            ),
            experience_years: readNumber(getProp(p, 'Experience')),
            institutions: readList(getProp(p, 'Institutions')),
            specializations: readList(getProp(p, 'Specializations')),
            bio: readText(getProp(p, 'Bio')) || null,
            know_more: readFlexible(getFirstProp(p, ['KnowMore', 'Know More', 'Know more'])),
            // Served through our own server so the link never expires.
            // ?v= changes when the row is edited, so a new photo shows up.
            photo_url: hasPhoto(getProp(p, 'Photo'))
              ? `/api/about-photo/${page.id}?v=${encodeURIComponent(page.last_edited_time ?? '')}`
              : null,
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
    maxAge: 30,
    swr: false,
    shouldBypassCache: () => import.meta.dev,
  },
)