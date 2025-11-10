export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 게시글 좋아요 토글
export async function POST(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

    const { id } = await params   // ✅ Next.js 15 이상: 반드시 await 필요
    const postId = parseInt(id)
    if (!postId || isNaN(postId))
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })

    // 게시글 존재 확인
    const [posts] = await db.query('SELECT id FROM posts WHERE id=?', [postId])
    if (!posts.length)
      return NextResponse.json({ error: 'POST_NOT_FOUND' }, { status: 404 })

    // 기존 좋아요 여부 확인
    const [existing] = await db.query(
      'SELECT id FROM post_likes WHERE post_id=? AND user_id=?',
      [postId, session.id]
    )

    let liked = false
    if (existing.length) {
      await db.query('DELETE FROM post_likes WHERE post_id=? AND user_id=?', [postId, session.id])
      liked = false
    } else {
      await db.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, session.id])
      liked = true
    }

    // 최신 좋아요 수 조회
    const [rows] = await db.query('SELECT likes_count FROM posts WHERE id=?', [postId])
    return NextResponse.json({ ok: true, liked, likesCount: rows[0]?.likes_count ?? 0 })
  } catch (err) {
    console.error('Like toggle error:', err)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 좋아요 상태 조회
export async function GET(request, { params }) {
  try {
    const session = await getSession()
    const { id } = await params   // ✅ 여기도 await 필수
    const postId = parseInt(id)
    if (!postId || isNaN(postId))
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })

    const [posts] = await db.query('SELECT likes_count FROM posts WHERE id=?', [postId])
    if (!session)
      return NextResponse.json({ liked: false, likesCount: posts[0]?.likes_count ?? 0 })

    const [likedRow] = await db.query(
      'SELECT id FROM post_likes WHERE post_id=? AND user_id=?',
      [postId, session.id]
    )
    return NextResponse.json({
      liked: !!likedRow.length,
      likesCount: posts[0]?.likes_count ?? 0
    })
  } catch (err) {
    console.error('Like status error:', err)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
