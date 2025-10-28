// app/api/tracks/route.js
export const runtime = 'nodejs' // Edge가 아닌 Node 런타임(네이티브 드라이버 필요)
import { NextResponse } from 'next/server'
import { getTracks, searchTracks } from '../../../lib/tracks'

export async function GET(request) {
    // ?q= 키워드가 있으면 검색, 없으면 전체 목록
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const rows = q ? await searchTracks(q) : await getTracks()
    return NextResponse.json(rows)
}
