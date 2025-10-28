// app/api/auth/kakao/route.js
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'

export async function GET() {
    const base = 'https://kauth.kakao.com/oauth/authorize'
    const params = new URLSearchParams({
        client_id: process.env.KAKAO_REST_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        response_type: 'code'
    })
    return NextResponse.redirect(`${base}?${params.toString()}`)
}
