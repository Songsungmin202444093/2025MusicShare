// app/api/auth/kakao/route.js
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET(req) {
    const base = 'https://kauth.kakao.com/oauth/authorize'
    const origin = new URL(req.url).origin
    const redirectUri = process.env.KAKAO_REDIRECT_URI || `${origin}/api/auth/kakao/callback`
    if (!process.env.KAKAO_REST_KEY) {
        return NextResponse.json({ error: 'Missing KAKAO_REST_KEY' }, { status: 500 })
    }
    const params = new URLSearchParams({
        client_id: process.env.KAKAO_REST_KEY,
        redirect_uri: redirectUri,
        response_type: 'code',
        // 이메일만 요청 (닉네임 등 프로필 정보는 요청하지 않음)
        scope: 'account_email'
    })
    return NextResponse.redirect(`${base}?${params.toString()}`)
}
