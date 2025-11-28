export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const YT_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos'

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY
  const region = process.env.YOUTUBE_REGION_CODE || 'KR'

  if (!key) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY_NOT_CONFIGURED' },
      { status: 500 }
    )
  }

  const url = new URL(YT_ENDPOINT)
  url.searchParams.set('part', 'snippet,statistics')
  url.searchParams.set('chart', 'mostPopular')
  url.searchParams.set('regionCode', region)
  url.searchParams.set('videoCategoryId', '10')
  url.searchParams.set('maxResults', '50')
  url.searchParams.set('key', key)

  const res = await fetch(url.toString())
  if (!res.ok) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_ERROR' },
      { status: 500 }
    )
  }

  const data = await res.json()
  const items = Array.isArray(data.items) ? data.items : []

  const tracks = items.map((v) => {
    const s = v.snippet || {}
    const thumbs = s.thumbnails || {}
    const thumb =
      thumbs.medium?.url ||
      thumbs.high?.url ||
      thumbs.default?.url ||
      null

    return {
      id: v.id,
      title: s.title || '',
      artist: s.channelTitle || '',
      thumbnail: thumb,
      publishedAt: s.publishedAt || null,
      youtubeUrl: v.id ? `https://www.youtube.com/watch?v=${v.id}` : null
    }
  })

  return NextResponse.json(tracks)
}
