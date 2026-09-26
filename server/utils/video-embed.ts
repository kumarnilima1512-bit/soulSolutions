export interface VideoEmbed {
  platform: 'youtube' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'direct' | 'unknown'
  embedUrl: string | null
  autoThumbnail: string | null
}

// Reads the raw URL saved in Notion and works out how it should be played.
// Never throws — falls back to 'unknown' for anything it can't parse.
export function detectVideoEmbed(url: string | null | undefined): VideoEmbed {
  const empty: VideoEmbed = { platform: 'unknown', embedUrl: null, autoThumbnail: null }
  if (!url) return empty

  let host = ''
  try {
    host = new URL(url).hostname.replace('www.', '')
  } catch {
    return empty
  }

  // Direct video file
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) {
    return { platform: 'direct', embedUrl: url, autoThumbnail: null }
  }

  // YouTube
  if (host.includes('youtube.com') || host.includes('youtu.be')) {
    const id = extractYouTubeId(url)
    if (id) {
      return {
        platform: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        autoThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }
    }
  }

  // Facebook (public video plugin, no API key needed)
  if (host.includes('facebook.com') || host.includes('fb.watch')) {
    return {
      platform: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      autoThumbnail: null,
    }
  }

  // Twitter / X
  if (host.includes('twitter.com') || host === 'x.com') {
    return { platform: 'twitter', embedUrl: url, autoThumbnail: null }
  }

  // Instagram — no link-only embed without an app review, so we fall back
  // to a "Watch on Instagram" card instead of pretending to embed it.
  if (host.includes('instagram.com')) {
    return { platform: 'instagram', embedUrl: url, autoThumbnail: null }
  }

  // LinkedIn — same story, no public embed from a plain link.
  if (host.includes('linkedin.com')) {
    return { platform: 'linkedin', embedUrl: url, autoThumbnail: null }
  }

  return { platform: 'unknown', embedUrl: url, autoThumbnail: null }
}

function extractYouTubeId(url: string): string | null {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{6,})/]
  for (const re of patterns) {
    const match = url.match(re)
    if (match?.[1]) return match[1]
  }
  return null
}

// Twitter's public oEmbed endpoint. No API key required. Never throws.
export async function fetchTwitterEmbedHtml(tweetUrl: string): Promise<string | null> {
  try {
    const res = await $fetch<{ html: string }>('https://publish.twitter.com/oembed', {
      params: { url: tweetUrl, omit_script: true, dnt: true },
    })
    return res.html ?? null
  } catch {
    return null
  }
}