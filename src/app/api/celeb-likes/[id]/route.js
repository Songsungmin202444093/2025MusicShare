export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function resolveCelebId(idOrSlug) {
  const raw = String(idOrSlug ?? '')
  // 캐시 확인
  if (celebIdCache.has(raw)) return celebIdCache.get(raw)

  const n = Number(raw)
  if (Number.isFinite(n) && String(n) === raw) {
    const [r] = await db.query('SELECT id FROM celeb WHERE id=? LIMIT 1', [n])
    if (r.length) {
      cacheSet(raw, r[0].id)
      return r[0].id
    }
  }
  const key = decodeURIComponent(raw)
  const [r2] = await db.query('SELECT id FROM celeb WHERE slug=? OR name=? LIMIT 1', [key, key])
  const id = r2?.[0]?.id ?? null
  cacheSet(raw, id)
  return id
}

// 간단한 메모리 캐시: 반복되는 slug/id 해석을 줄여 응답 시간 개선
const celebIdCache = new Map()
function cacheSet(key, value) {
  celebIdCache.set(key, value)
  // 단순한 사이즈 제한(최신 1000개 유지)
  if (celebIdCache.size > 1000) celebIdCache.delete(celebIdCache.keys().next().value)
}

export async function GET(req, { params }) {
  const { id } = await params
  const celebId = await resolveCelebId(id)
  if (!celebId) return NextResponse.json({ liked: false, count: 0 })

  const session = await getSession()

  // precomputed likes_count와 현재 사용자의 liked 여부를 별도 쿼리로 조회
  const [celebData] = await db.query('SELECT likes_count FROM celeb WHERE id=?', [celebId])
  if (!celebData.length) return NextResponse.json({ liked: false, count: 0 })
  
  const likes_count = celebData[0].likes_count
  let liked = false
  if (session) {
    const [userLike] = await db.query('SELECT 1 FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
    liked = userLike.length > 0
  }
  // 익명 사용자에 대해서는 짧은 캐시 허용
  if (!session) {
    return NextResponse.json({ liked, count: likes_count }, { headers: { 'Cache-Control': 'public, max-age=5' } })
  }
  return NextResponse.json({ liked, count: likes_count })
}

export async function POST(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { id } = await params
  const celebId = await resolveCelebId(id)
  if (!celebId) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

  const [ex] = await db.query('SELECT id FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
  const isAdding = !ex.length

  if (isAdding) {
    await db.query('INSERT INTO celeb_like_users (user_id, celeb_id) VALUES (?, ?)', [session.id, celebId])
    // 좋아요 추가: likes_count 증가
    await db.query('UPDATE celeb SET likes_count = likes_count + 1 WHERE id=?', [celebId])
  } else {
    await db.query('DELETE FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
    // 좋아요 제거: likes_count 감소 (최소값 0)
    await db.query('UPDATE celeb SET likes_count = GREATEST(0, likes_count - 1) WHERE id=?', [celebId])
  }

  // precomputed likes_count 읽기
  const [cnt] = await db.query('SELECT likes_count FROM celeb WHERE id=?', [celebId])
  return NextResponse.json({ liked: isAdding, count: cnt[0].likes_count })
}
