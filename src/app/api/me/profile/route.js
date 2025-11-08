export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession, createSessionToken, setSessionCookieOn } from '../../../../lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const [rows] = await db.query(
    `SELECT id, name, email, gender, birth_date AS birthDate,
            favorite_genres AS favoriteGenres, favorite_influencer AS favoriteInfluencer
       FROM users WHERE id = ?`,
    [session.id]
  )
  const user = rows?.[0]
  if (!user) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  return NextResponse.json({ ok: true, user })
}

export async function PUT(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

    const body = await req.json()
    const {
      name,
      gender,
      birthDate,
      favoriteGenres, // string or array
      favoriteInfluencer
    } = body || {}

    // 기본 검증: 이름은 필수로 제한
    if (!name) return NextResponse.json({ error: 'INVALID' }, { status: 400 })

    const genresStr = Array.isArray(favoriteGenres)
      ? favoriteGenres.join(',')
      : (favoriteGenres || null)

    await db.query(
      `UPDATE users
         SET name = ?, gender = ?, birth_date = ?, favorite_genres = ?, favorite_influencer = ?
       WHERE id = ?`,
      [name, gender || null, birthDate || null, genresStr, favoriteInfluencer || null, session.id]
    )

    // 이름이 바뀌면 헤더에 반영되도록 세션 재발급
    let res = NextResponse.json({ ok: true })
    if (name !== session.name) {
      const token = createSessionToken({ id: session.id, name, email: session.email })
      setSessionCookieOn(res, token)
    }
    return res
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'SERVER' }, { status: 500 })
  }
}
