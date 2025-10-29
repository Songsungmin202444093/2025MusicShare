export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

async function getToken(code) {
    const url = 'https://kauth.kakao.com/oauth/token'
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code
    })
    if (process.env.KAKAO_CLIENT_SECRET) body.append('client_secret', process.env.KAKAO_CLIENT_SECRET)
    const res = await fetch(url, { method: 'POST', body })
    return res.json()
}

async function getUserInfo(accessToken) {
    const res = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.json()
}

export async function GET(req) {
    const code = new URL(req.url).searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'no code' }, { status: 400 })

    const token = await getToken(code)
    if (token.error) {
        // 토큰 교환 실패 시 인증 페이지로 에러와 함께 리다이렉트
        const url = new URL('/auth', process.env.KAKAO_REDIRECT_URI || 'http://localhost:3000')
        url.searchParams.set('social', 'kakao')
        url.searchParams.set('error', token.error || 'token_exchange_failed')
        return NextResponse.redirect(url.toString())
    }

    const user = await getUserInfo(token.access_token)
    // Kakao 사용자 정보 파싱
    const kakaoId = user?.id
    const nickname = user?.properties?.nickname || '카카오 사용자'
    const email = user?.kakao_account?.email || null

    // 이메일이 없는 경우: 콘솔에서 이메일 동의 항목을 설정했는지 확인 필요
    if (!email) {
        const url = new URL('/auth', process.env.KAKAO_REDIRECT_URI || 'http://localhost:3000')
        url.searchParams.set('social', 'kakao')
        url.searchParams.set('error', 'email_required')
        return NextResponse.redirect(url.toString())
    }

    // DB upsert (email 기준)
    try {
        const [rows] = await db.query('SELECT id, name, email FROM users WHERE email=?', [email])
        let userId = rows?.[0]?.id
        if (!userId) {
            // 소셜 계정용 임시 비밀번호 생성 후 해시 저장 (로그인에는 사용되지 않음)
            const temp = crypto.randomBytes(16).toString('hex')
            const hash = await bcrypt.hash(temp, 10)
            const [result] = await db.query(
                `INSERT INTO users (name, gender, birth_date, favorite_genres, favorite_influencer, email, password_hash)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nickname, null, null, null, null, email, hash]
            )
            userId = result.insertId
        }

        // NOTE: 세션/JWT 발급은 이후 단계에서 구현 가능. 지금은 돌아갈 위치로 리다이렉트만 수행.
        const url = new URL('/', process.env.KAKAO_REDIRECT_URI || 'http://localhost:3000')
        url.searchParams.set('login', 'success')
        url.searchParams.set('via', 'kakao')
        return NextResponse.redirect(url.toString())
    } catch (err) {
        console.error('Kakao callback DB error:', err)
        const url = new URL('/auth', process.env.KAKAO_REDIRECT_URI || 'http://localhost:3000')
        url.searchParams.set('social', 'kakao')
        url.searchParams.set('error', 'server')
        return NextResponse.redirect(url.toString())
    }
}
