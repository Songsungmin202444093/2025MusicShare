export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function resolveCelebId(idOrSlug) {
  const raw = String(idOrSlug ?? '')
  const n = Number(raw)
  if (Number.isFinite(n) && String(n) === raw) {
    const [r] = await db.query('SELECT id FROM celeb WHERE id=? LIMIT 1', [n])
    if (r.length) return r[0].id
  }
  const key = decodeURIComponent(raw)
  const [r2] = await db.query('SELECT id FROM celeb WHERE slug=? OR name=? LIMIT 1', [key, key])
  return r2?.[0]?.id ?? null
}

export async function GET(req, { params }) {
  const { id } = await params
  const celebId = await resolveCelebId(id)
  if (!celebId) return NextResponse.json({ liked: false, count: 0 })

  const [cnt] = await db.query('SELECT COUNT(*) c FROM celeb_like_users WHERE celeb_id=?', [celebId])

  const session = await getSession()
  if (!session) return NextResponse.json({ liked: false, count: cnt[0].c })

  const [me] = await db.query('SELECT 1 FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
  return NextResponse.json({ liked: !!me.length, count: cnt[0].c })
}

export async function POST(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { id } = await params
  const celebId = await resolveCelebId(id)
  if (!celebId) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

  const [ex] = await db.query('SELECT id FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
  if (ex.length) {
    await db.query('DELETE FROM celeb_like_users WHERE user_id=? AND celeb_id=?', [session.id, celebId])
  } else {
    await db.query('INSERT INTO celeb_like_users (user_id, celeb_id) VALUES (?, ?)', [session.id, celebId])
  }

  const [cnt] = await db.query('SELECT COUNT(*) c FROM celeb_like_users WHERE celeb_id=?', [celebId])
  return NextResponse.json({ liked: !ex.length, count: cnt[0].c })
}
