// src/app/api/comments/[id]/route.js
// 개별 댓글 관리 API (수정/삭제)
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 댓글 수정
export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const resolvedParams = await params
    const commentId = parseInt(resolvedParams.id)
    
    if (!commentId || isNaN(commentId)) {
      return NextResponse.json({ error: 'INVALID_COMMENT_ID' }, { status: 400 })
    }

    const { content } = await request.json()

    // 입력 검증
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_CONTENT' }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'CONTENT_TOO_LONG' }, { status: 400 })
    }

    // 댓글 존재 및 소유권 확인
    const [comments] = await db.query(
      'SELECT user_id FROM post_comments WHERE id = ?',
      [commentId]
    )
    
    if (comments.length === 0) {
      return NextResponse.json({ error: 'COMMENT_NOT_FOUND' }, { status: 404 })
    }

    if (comments[0].user_id !== session.id) {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
    }

    // 댓글 수정
    await db.query(
      'UPDATE post_comments SET content = ?, updated_at = NOW() WHERE id = ?',
      [content.trim(), commentId]
    )

    // 수정된 댓글 정보 조회
    const [updatedComment] = await db.query(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        u.id as user_id,
        u.name
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId])

    return NextResponse.json({
      ok: true,
      comment: updatedComment[0]
    })

  } catch (error) {
    console.error('Comment update error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 댓글 삭제
export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const resolvedParams = await params
    const commentId = parseInt(resolvedParams.id)
    
    if (!commentId || isNaN(commentId)) {
      return NextResponse.json({ error: 'INVALID_COMMENT_ID' }, { status: 400 })
    }

    // 댓글 존재 및 소유권 확인
    const [comments] = await db.query(
      'SELECT user_id, post_id FROM post_comments WHERE id = ?',
      [commentId]
    )
    
    if (comments.length === 0) {
      return NextResponse.json({ error: 'COMMENT_NOT_FOUND' }, { status: 404 })
    }

    if (comments[0].user_id !== session.id) {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
    }

    const postId = comments[0].post_id

    // 댓글 삭제
    await db.query('DELETE FROM post_comments WHERE id = ?', [commentId])

    // 댓글 수 수동 업데이트
    const [commentCountResult] = await db.query('SELECT COUNT(*) as count FROM post_comments WHERE post_id=?', [postId])
    const newCommentsCount = commentCountResult[0].count
    await db.query('UPDATE posts SET comments_count=? WHERE id=?', [newCommentsCount, postId])

    return NextResponse.json({ ok: true, commentsCount: newCommentsCount })

  } catch (error) {
    console.error('Comment deletion error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}