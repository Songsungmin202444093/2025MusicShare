// src/app/api/celeb-recommendations/route.js
// 셀럽 검색 API (포토카드용)
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { searchCelebs } from '@/lib/tracks'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    
    if (!q.trim()) {
      return NextResponse.json([])
    }

    const results = await searchCelebs(q.trim())
    return NextResponse.json(results)
  } catch (error) {
    console.error('Celeb search error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
