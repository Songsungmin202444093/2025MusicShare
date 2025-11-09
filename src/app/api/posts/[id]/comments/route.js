// src/app/api/posts/[id]/comments/route.js
// 게시글 댓글 API
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 댓글 목록 조회
export async function GET(request, { params }) {
  try {
    const postId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const offset = (page - 1) * limit

    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: 'INVALID_POST_ID' }, { status: 400 })
    }

    // 댓글 목록 조회 (사용자 정보 포함)
    const [comments] = await db.query(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as user_id,
        u.name
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `, [postId, limit, offset])

    // 총 댓글 수 조회
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM post_comments WHERE post_id = ?',
      [postId]
    )
    
    const total = totalResult[0].total
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 댓글 작성
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

    const { content } = await request.json()

    // 입력 검증
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_CONTENT' }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'CONTENT_TOO_LONG' }, { status: 400 })
    }

    // 게시글 존재 확인
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId])
    if (posts.length === 0) {
      return NextResponse.json({ error: 'POST_NOT_FOUND' }, { status: 404 })
    }

    // 댓글 추가
    const [result] = await db.query(`
      INSERT INTO post_comments (post_id, user_id, content) 
      VALUES (?, ?, ?)
    `, [postId, session.id, content.trim()])

    // 생성된 댓글 정보 조회 (사용자 정보 포함)
    const [newComment] = await db.query(`
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as user_id,
        u.name
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId])

    return NextResponse.json({
      ok: true,
      comment: newComment[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}