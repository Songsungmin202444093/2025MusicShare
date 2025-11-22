// src/app/api/auth/reset-password/confirm/route.js
// 비밀번호 재설정 확인 및 변경
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 })
    }

    // 토큰으로 사용자 조회
    const [users] = await db.query(
      'SELECT id, email, token_expires_at FROM users WHERE verification_token = ?',
      [token]
    )

    if (users.length === 0) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 })
    }

    const user = users[0]

    // 토큰 만료 확인
    if (new Date(user.token_expires_at) < new Date()) {
      return NextResponse.json({ error: '토큰이 만료되었습니다. 다시 요청해주세요.' }, { status: 400 })
    }

    // 새 비밀번호 해시
    const hash = await bcrypt.hash(newPassword, 10)

    // 비밀번호 업데이트 및 토큰 삭제
    await db.query(
      'UPDATE users SET password_hash = ?, verification_token = NULL, token_expires_at = NULL WHERE id = ?',
      [hash, user.id]
    )

    return NextResponse.json({ 
      ok: true, 
      message: '비밀번호가 성공적으로 변경되었습니다.' 
    })

  } catch (error) {
    console.error('Password reset confirm error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
