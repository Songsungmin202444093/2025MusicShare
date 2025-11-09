// src/app/api/me/comments/route.js
// 내 댓글 목록 조회 API
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = (page - 1) * limit

    // 내 댓글 목록 조회 (게시물 정보 포함)
    const [comments] = await db.query(`
      SELECT 
        c.id, c.content, c.created_at, c.updated_at,
        c.post_id,
        p.content as post_content,
        p.likes_count, p.comments_count,
        post_author.name as post_author_name,
        u.name, u.id as user_id
      FROM post_comments c
      JOIN users u ON c.user_id = u.id
      JOIN posts p ON c.post_id = p.id
      JOIN users post_author ON p.user_id = post_author.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [session.id, limit, offset])

    // 총 댓글 수 조회
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM post_comments WHERE user_id = ?',
      [session.id]
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
    console.error('My comments fetch error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}