// src/app/api/me/posts/route.js
// 내 게시물 목록 조회 API
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

    // 내 게시물 목록 조회
    const [posts] = await db.query(`
      SELECT 
        p.id, p.content, p.image_url, p.likes_count, p.comments_count, p.created_at,
        u.name, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [session.id, limit, offset])

    // 총 게시물 수 조회
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM posts WHERE user_id = ?',
      [session.id]
    )
    
    const total = totalResult[0].total
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
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
    console.error('My posts fetch error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}