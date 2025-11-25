// 이메일 인증 재발송 API
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendVerificationEmail, generateVerificationToken } from '@/lib/email'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'INVALID' }, { status: 400 })
    }

    // 사용자 조회
    const [rows] = await db.query(
      'SELECT id, email, email_verified FROM users WHERE email=?',
      [email]
    )

    if (!rows.length) {
      return NextResponse.json({ error: 'NOT_FOUND', message: '해당 이메일로 가입된 계정이 없습니다.' }, { status: 404 })
    }

    const user = rows[0]

    // 이미 인증된 경우
    if (user.email_verified) {
      return NextResponse.json({ error: 'ALREADY_VERIFIED', message: '이미 인증된 계정입니다.' }, { status: 400 })
    }

    // 새로운 인증 토큰 생성
    const verificationToken = generateVerificationToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후

    // DB에 토큰 업데이트
    await db.query(
      'UPDATE users SET verification_token=?, token_expires_at=? WHERE id=?',
      [verificationToken, tokenExpiry, user.id]
    )

    console.log(`[인증 재발송] 이메일 발송 시도: ${email}`)
    
    // 인증 이메일 발송
    const emailResult = await sendVerificationEmail(email, verificationToken)

    if (!emailResult.success) {
      console.error('❌ 인증 이메일 재발송 실패:', emailResult.error)
      return NextResponse.json({ 
        error: 'EMAIL_SEND_FAILED', 
        message: '인증 이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
        details: emailResult.error
      }, { status: 500 })
    }

    console.log(`✅ 인증 이메일 재발송 성공: ${email}`)

    return NextResponse.json({ 
      ok: true, 
      message: '인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.' 
    })
  } catch (err) {
    console.error('인증 이메일 재발송 오류:', err)
    return NextResponse.json({ error: 'SERVER' }, { status: 500 })
  }
}
