// src/app/api/auth/verify/route.js
// 이메일 인증 처리
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSessionToken, setSessionCookieOn } from '@/lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth?error=invalid_token', request.url))
    }

    // 토큰으로 사용자 조회
    const [users] = await db.query(
      `SELECT id, name, email, email_verified, token_expires_at 
       FROM users 
       WHERE verification_token = ?`,
      [token]
    )

    if (users.length === 0) {
      return NextResponse.redirect(new URL('/auth?error=invalid_token', request.url))
    }

    const user = users[0]

    // 이미 인증된 경우
    if (user.email_verified) {
      return NextResponse.redirect(new URL('/auth?message=already_verified', request.url))
    }

    // 토큰 만료 확인
    if (new Date(user.token_expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/auth?error=token_expired', request.url))
    }

    // 이메일 인증 처리
    await db.query(
      `UPDATE users 
       SET email_verified = TRUE, 
           verification_token = NULL, 
           token_expires_at = NULL 
       WHERE id = ?`,
      [user.id]
    )

    // 자동 로그인 처리
    const sessionToken = createSessionToken({ 
      id: user.id, 
      name: user.name, 
      email: user.email 
    })
    
    const response = NextResponse.redirect(new URL('/?verified=true', request.url))
    setSessionCookieOn(response, sessionToken)
    
    return response

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth?error=server_error', request.url))
  }
}
