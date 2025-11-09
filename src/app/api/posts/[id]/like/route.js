// src/app/api/posts/[id]/like/route.js
// 게시글 좋아요 토글 API
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const postId = parseInt(params.id)
    
    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })
    }

    // 게시글 존재 확인
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId])
    if (posts.length === 0) {
      return NextResponse.json({ error: 'POST_NOT_FOUND' }, { status: 404 })
    }

    // 기존 좋아요 확인
    const [existingLikes] = await db.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, session.id]
    )

    let liked = false
    
    if (existingLikes.length > 0) {
      // 좋아요 취소
      await db.query(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, session.id]
      )
      liked = false
    } else {
      // 좋아요 추가
      await db.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [postId, session.id]
      )
      liked = true
    }

    // 업데이트된 좋아요 수 조회 (트리거로 자동 업데이트됨)
    const [updatedPost] = await db.query(
      'SELECT likes_count FROM posts WHERE id = ?',
      [postId]
    )

    return NextResponse.json({ 
      ok: true, 
      liked,
      likesCount: updatedPost[0].likes_count
    })

  } catch (error) {
    console.error('Like toggle error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 사용자의 좋아요 상태 확인
export async function GET(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ liked: false, likesCount: 0 })
    }

    const postId = parseInt(params.id)
    
    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })
    }

    const [likes] = await db.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, session.id]
    )

    const [posts] = await db.query(
      'SELECT likes_count FROM posts WHERE id = ?',
      [postId]
    )

    return NextResponse.json({
      liked: likes.length > 0,
      likesCount: posts[0]?.likes_count || 0
    })

  } catch (error) {
    console.error('Like status error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}