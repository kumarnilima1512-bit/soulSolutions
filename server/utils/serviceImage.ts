interface NotionFile {
  type: 'file' | 'external'
  file?: { url: string }
  external?: { url: string }
}

const fileUrl = (f?: NotionFile) => (f?.type === 'file' ? f.file?.url : f?.external?.url) ?? null

// Resized image is cached on the server per (id, width, version), so Notion and sharp run once per image
export const getServiceImage = defineCachedFunction(
  async (id: string, width: number, _version: string) => {
    const page = await $fetch<{ properties: { Image?: { files: NotionFile[] } } }>(
      `https://api.notion.com/v1/pages/${id}`,
      { headers: notionHeaders() },
    )

    const src = fileUrl(page.properties.Image?.files?.[0])
    if (!src) return null

    const raw = await $fetch<ArrayBuffer>(src, { responseType: 'arrayBuffer' })
    let body = Buffer.from(raw)
    let contentType = 'image/jpeg'

    try {
      const sharp = (await import('sharp')).default
      body = await sharp(body).resize({ width, withoutEnlargement: true }).webp({ quality: 75 }).toBuffer()
      contentType = 'image/webp'
    } catch {
      // sharp not available, serve the original bytes
    }

    return { data: body.toString('base64'), contentType }
  },
  {
    name: 'service-image',
    maxAge: 60 * 60 * 24 * 7,
    swr: false,
    getKey: (id: string, width: number, version: string) => `${id}-${width}-${version}`,
  },
)