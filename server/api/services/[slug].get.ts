interface RichText {
  plain_text: string
  href: string | null
  annotations: { bold: boolean; italic: boolean; code: boolean }
}
interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}
interface NotionBlock {
  id: string
  type: string
  [key: string]: any
}
interface NotionPage {
  id: string
  properties: {
    Name?: { title: RichText[] }
    Slug?: { rich_text: RichText[] }
    ShortDescription?: { rich_text: RichText[] }
    Image?: { files: NotionFile[] }
  }
}

const text = (arr?: RichText[]) => (arr ?? []).map((t) => t.plain_text).join('')
const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

const runs = (arr?: RichText[]) =>
  (arr ?? []).map((t) => ({
    text: t.plain_text,
    bold: t.annotations.bold,
    italic: t.annotations.italic,
    code: t.annotations.code,
    href: t.href,
  }))

const mapBlock = (b: NotionBlock) => {
  const base = { id: b.id, type: b.type }
  switch (b.type) {
    case 'paragraph':
      return { ...base, runs: runs(b.paragraph.rich_text) }
    case 'heading_1':
      return { ...base, runs: runs(b.heading_1.rich_text) }
    case 'heading_2':
      return { ...base, runs: runs(b.heading_2.rich_text) }
    case 'heading_3':
      return { ...base, runs: runs(b.heading_3.rich_text) }
    case 'bulleted_list_item':
      return { ...base, runs: runs(b.bulleted_list_item.rich_text) }
    case 'numbered_list_item':
      return { ...base, runs: runs(b.numbered_list_item.rich_text) }
    case 'quote':
      return { ...base, runs: runs(b.quote.rich_text) }
    case 'image':
      return { ...base, url: fileUrl(b.image), caption: text(b.image.caption) }
    case 'divider':
      return base
    default:
      return null
  }
}

export default cachedEventHandler(
  async (event) => {
    const slug = getRouterParam(event, 'slug')
    const config = useRuntimeConfig()

    try {
      const dataSourceId = await getDataSourceId(config.notionServicesDatabaseId)

      const query = await $fetch<{ results: NotionPage[] }>(
        `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
        {
          method: 'POST',
          headers: notionHeaders(),
          body: {
            filter: {
              and: [
                { property: 'Slug', rich_text: { equals: slug } },
                { property: 'Active', checkbox: { equals: true } },
              ],
            },
          },
        },
      )

      const page = query.results[0]
      if (!page) throw createError({ statusCode: 404, statusMessage: 'Service not found' })

      const p = page.properties
      const blocksRes = await $fetch<{ results: NotionBlock[] }>(
        `https://api.notion.com/v1/blocks/${page.id}/children?page_size=100`,
        { headers: notionHeaders() },
      )

      return {
        name: text(p.Name?.title),
        shortDescription: text(p.ShortDescription?.rich_text),
        image: fileUrl(p.Image?.files?.[0]),
        blocks: blocksRes.results.map(mapBlock).filter(Boolean),
      }
    } catch (err: any) {
      if (err?.statusCode === 404) throw err
      console.error('Notion service detail fetch failed:', err)
      throw createError({ statusCode: 500, statusMessage: 'Could not load this service' })
    }
  },
  { maxAge: 60, swr: false },
)