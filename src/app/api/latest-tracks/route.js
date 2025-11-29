export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

const YT_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search'
const YT_VIDEOS_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos'

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY
  const region = process.env.YOUTUBE_REGION_CODE || 'KR'

  if (!key) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY_NOT_CONFIGURED' },
      { status: 500 }
    )
  }

  try {
    // 최근 3개월 날짜 계산
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const publishedAfter = threeMonthsAgo.toISOString()

    // 1. 검색 API로 최근 3개월 음악 영상 가져오기
    const searchUrl = new URL(YT_SEARCH_ENDPOINT)
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('q', 'kpop music') // 검색어 단순화
    searchUrl.searchParams.set('order', 'viewCount') // 조회수 순으로 변경
    searchUrl.searchParams.set('publishedAfter', publishedAfter) // 최근 3개월
    searchUrl.searchParams.set('regionCode', region)
    searchUrl.searchParams.set('maxResults', '50')
    searchUrl.searchParams.set('videoCategoryId', '10') // 음악 카테고리
    searchUrl.searchParams.set('key', key)

    const searchRes = await fetch(searchUrl.toString())
    
    if (!searchRes.ok) {
      const errorData = await searchRes.json().catch(() => ({}))
      console.error('YouTube Search API Error:', errorData)
      return NextResponse.json(
        { error: 'YOUTUBE_API_ERROR', details: errorData },
        { status: 500 }
      )
    }

    const searchData = await searchRes.json()
    const items = Array.isArray(searchData.items) ? searchData.items : []

    // 2. 비디오 ID 추출
    const videoIds = items
      .map(v => typeof v.id === 'string' ? v.id : v.id?.videoId)
      .filter(Boolean)

    if (videoIds.length === 0) {
      return NextResponse.json([])
    }

    // 3. Videos API로 상세 정보 가져오기 (duration, statistics 포함)
    const videosUrl = new URL(YT_VIDEOS_ENDPOINT)
    videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
    videosUrl.searchParams.set('id', videoIds.join(','))
    videosUrl.searchParams.set('key', key)

    const videosRes = await fetch(videosUrl.toString())
    
    if (!videosRes.ok) {
      const errorData = await videosRes.json().catch(() => ({}))
      console.error('YouTube Videos API Error:', errorData)
      return NextResponse.json(
        { error: 'YOUTUBE_API_ERROR', details: errorData },
        { status: 500 }
      )
    }

    const videosData = await videosRes.json()
    const videoItems = Array.isArray(videosData.items) ? videosData.items : []

    // 4. 쇼츠 제외 및 리액션/커버 필터링 후 조회수 순 정렬
    const filteredTracks = videoItems
      .filter(v => {
        const duration = v.contentDetails?.duration || ''
        const title = (v.snippet?.title || '').toLowerCase()
        const viewCount = parseInt(v.statistics?.viewCount || '0')
        
        // 쇼츠 제외 (60초 이하)
        const isShort = /^PT[0-5]?\dS$/.test(duration) || duration === 'PT1M'
        if (isShort) return false
        
        // 조회수가 너무 낮은 영상 제외 (최소 5만뷰로 낮춤)
        if (viewCount < 50000) return false
        
        // 리액션, 커버, 편집본 등 제외 (더 엄격하게)
        const excludeKeywords = [
          'reaction', 'react', '리액션',
          'cover', '커버',
          'remix', '리믹스',
          'compilation', '모음',
          'fancam', '직캠'
        ]
        
        const hasExcludeKeyword = excludeKeywords.some(keyword => 
          title.includes(keyword)
        )
        
        if (hasExcludeKeyword) return false
        
        // 너무 엄격한 필터 완화 - 제외 키워드만 걸러내기
        return true
      })
      .map((v) => {
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
          viewCount: parseInt(v.statistics?.viewCount || '0'),
          youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`
        }
      })
      .sort((a, b) => b.viewCount - a.viewCount) // 조회수 높은 순 정렬
      .slice(0, 30) // 30개만

    return NextResponse.json(filteredTracks)
  } catch (error) {
    console.error('Latest tracks fetch error:', error)
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: error.message },
      { status: 500 }
    )
  }
}
