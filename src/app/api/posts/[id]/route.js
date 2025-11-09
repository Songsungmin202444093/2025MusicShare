// src/app/api/posts/[id]/route.js
// 개별 게시글 상세 조회 및 삭제 API
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const postId = parseInt(params.id)
    
    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })
    }

    const [posts] = await db.query(`
      SELECT 
        p.id, p.content, p.image_url, p.likes_count, p.comments_count, p.created_at,
        u.name as user_name, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId])

    if (posts.length === 0) {
      return NextResponse.json({ error: 'POST_NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json({ post: posts[0] })

  } catch (error) {
    console.error('Post fetch error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 게시글 삭제
export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const postId = parseInt(params.id)
    
    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })
    }

    // 게시글 존재 및 소유권 확인
    const [posts] = await db.query(
      'SELECT user_id FROM posts WHERE id = ?',
      [postId]
    )
    
    if (posts.length === 0) {
      return NextResponse.json({ error: 'POST_NOT_FOUND' }, { status: 404 })
    }

    if (posts[0].user_id !== session.id) {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
    }

    // 게시글 삭제 (CASCADE로 좋아요와 댓글도 자동 삭제됨)
    await db.query('DELETE FROM posts WHERE id = ?', [postId])

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Post deletion error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}