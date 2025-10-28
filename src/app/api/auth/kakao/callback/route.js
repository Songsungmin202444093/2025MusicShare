export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

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
    if (token.error) return NextResponse.json(token, { status: 400 })

    const user = await getUserInfo(token.access_token)
    // TODO: DB upsert + 세션/JWT 발급 후 원하는 페이지로 리다이렉트
    return NextResponse.json({ user, token })
}
