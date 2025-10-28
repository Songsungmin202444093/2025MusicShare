// ✅ Node.js 런타임 사용 설정 (Edge Runtime에서는 mysql2 동작 불가)
export const runtime = 'nodejs'

// ✅ 필요한 모듈 불러오기
import { NextResponse } from 'next/server' // Next.js Response 유틸
import { db } from '@/lib/db'              // DB 연결 풀 가져오기
import bcrypt from 'bcryptjs'              // 비밀번호 암호화 라이브러리

// ✅ POST 메서드로 회원가입 요청 처리
export async function POST(req) {
    try {
        // 1️⃣ 클라이언트에서 보낸 JSON 데이터 파싱
        const { name, gender, birthDate, favoriteGenres, favoriteInfluencer, email, password } = await req.json()

        // 2️⃣ 필수 입력값 검증 (이름, 이메일, 비밀번호)
        if (!name || !email || !password)
            return NextResponse.json({ error: 'INVALID' }, { status: 400 })

        // 3️⃣ 이메일 중복 확인
        const [dup] = await db.query('SELECT id FROM users WHERE email=?', [email])
        if (dup.length)
            return NextResponse.json({ error: 'DUPLICATE' }, { status: 409 })

        // 4️⃣ 비밀번호 해시 처리 (bcrypt)
        const hash = await bcrypt.hash(password, 10)

        // 5️⃣ DB에 회원 데이터 저장
        await db.query(
            `INSERT INTO users (name, gender, birth_date, favorite_genres, favorite_influencer, email, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, gender || null, birthDate || null, favoriteGenres || null, favoriteInfluencer || null, email, hash]
        )

        // 6️⃣ 성공 응답 반환
        return NextResponse.json({ ok: true })
    } catch (err) {
        // 7️⃣ 예외 발생 시 서버 오류 응답
        console.error('회원가입 오류:', err)
        return NextResponse.json({ error: 'SERVER' }, { status: 500 })
    }
}
