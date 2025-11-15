// src/app/api/posts/route.js
// 게시글 목록 조회 및 새 게시글 작성 API
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 게시글 목록 조회 (최신순)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const [posts] = await db.query(`
      SELECT 
        p.id, p.content, p.image_url, p.youtube_embed, p.likes_count, p.comments_count, p.created_at,
        u.name, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])

    return NextResponse.json({ 
      posts,
      pagination: { page, limit, hasMore: posts.length === limit }
    })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}

// 새 게시글 작성
export async function POST(request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { content, imageUrl, youtube_embed } = await request.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'CONTENT_REQUIRED' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'CONTENT_TOO_LONG' }, { status: 400 })
    }

    const [result] = await db.query(`
      INSERT INTO posts (user_id, content, image_url, youtube_embed)
      VALUES (?, ?, ?, ?)
    `, [session.id, content.trim(), imageUrl || null, youtube_embed || null])

    // 생성된 게시글 정보 조회
    const [posts] = await db.query(`
      SELECT 
        p.id, p.content, p.image_url, p.youtube_embed, p.likes_count, p.comments_count, p.created_at,
        u.name, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.insertId])

    return NextResponse.json({ 
      ok: true, 
      post: posts[0] 
    }, { status: 201 })

  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}