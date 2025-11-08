export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { clearSessionCookieOn } from '../../../../lib/auth'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const redirectTo = url.searchParams.get('next') || '/'
    // 절대 URL로 리다이렉트 생성 (상대 경로 전달 시 500 방지)
    const res = NextResponse.redirect(new URL(redirectTo, req.url))
    clearSessionCookieOn(res)
    return res
  } catch (err) {
    console.error('Logout GET error:', err)
    return NextResponse.json({ ok: false, error: 'SERVER' }, { status: 500 })
  }
}

export async function POST(req) {
  // POST로도 지원 (fetch 사용 시)
  const res = NextResponse.json({ ok: true })
  clearSessionCookieOn(res)
  return res
}
