// ✅ Node.js 런타임 지정
export const runtime = 'nodejs'

// ✅ 필요한 모듈 불러오기
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSessionToken, setSessionCookieOn } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

// ✅ POST 메서드로 로그인 요청 처리
export async function POST(req) {
  try {
    // 1️⃣ 요청 JSON 데이터 파싱
    const { email, password } = await req.json()

    // 2️⃣ 필수 항목 검증
    if (!email || !password)
      return NextResponse.json({ error: 'INVALID' }, { status: 400 })

    // 3️⃣ 해당 이메일의 사용자 조회
    const [rows] = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email=?',
      [email]
    )

    // 4️⃣ 존재하지 않으면 에러 반환
    if (!rows.length)
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })

    const user = rows[0]

    // 5️⃣ 입력 비밀번호와 해시된 비밀번호 비교
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok)
      return NextResponse.json({ error: 'WRONG_PASSWORD' }, { status: 401 })

    // 6️⃣ 로그인 성공 시 세션 토큰 발급 및 쿠키 설정
    const token = createSessionToken({ id: user.id, name: user.name, email: user.email })
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email }
    })
    setSessionCookieOn(res, token)
    return res
  } catch (err) {
    // 7️⃣ 예외 처리
    console.error('로그인 오류:', err)
    return NextResponse.json({ error: 'SERVER' }, { status: 500 })
  }
}
