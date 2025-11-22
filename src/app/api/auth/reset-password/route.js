// src/app/api/auth/reset-password/route.js
// 비밀번호 재설정 요청 (이메일 발송)
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendPasswordResetEmail, generateVerificationToken } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 })
    }

    // 이메일로 사용자 조회
    const [users] = await db.query('SELECT id, name, email FROM users WHERE email = ?', [email])

    if (users.length === 0) {
      // 보안상 이유로 존재 여부를 명확히 알리지 않음
      return NextResponse.json({ 
        ok: true, 
        message: '해당 이메일로 비밀번호 재설정 링크를 발송했습니다.' 
      })
    }

    const user = users[0]

    // 재설정 토큰 생성
    const resetToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1시간 후

    // DB에 토큰 저장
    await db.query(
      'UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?',
      [resetToken, tokenExpiry, user.id]
    )

    // 비밀번호 재설정 이메일 발송
    const emailResult = await sendPasswordResetEmail(email, resetToken)

    if (!emailResult.success) {
      console.error('비밀번호 재설정 이메일 발송 실패:', emailResult.error)
      return NextResponse.json({ error: '이메일 발송에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      message: '비밀번호 재설정 링크를 이메일로 발송했습니다.' 
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
