export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ liked: false })
  const [rows] = await db.query(
    'SELECT 1 FROM track_likes WHERE user_id=? AND track_id=?',
    [session.id, params.trackId]
  )
  return NextResponse.json({ liked: !!rows.length })
}

export async function POST(_, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const userId = session.id
  const trackId = Number(params.trackId)

  const [rows] = await db.query(
    'SELECT id FROM track_likes WHERE user_id=? AND track_id=?',
    [userId, trackId]
  )

  if (rows.length) {
    await db.query('DELETE FROM track_likes WHERE user_id=? AND track_id=?', [userId, trackId])
    await db.query('UPDATE tracks SET likes = GREATEST(likes-1, 0) WHERE id=?', [trackId])
    return NextResponse.json({ liked: false })
  } else {
    await db.query('INSERT INTO track_likes (user_id, track_id) VALUES (?, ?)', [userId, trackId])
    await db.query('UPDATE tracks SET likes = likes+1 WHERE id=?', [trackId])
    return NextResponse.json({ liked: true })
  }
}
