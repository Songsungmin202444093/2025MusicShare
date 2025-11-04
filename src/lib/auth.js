// src/lib/auth.js
// 간단한 서명 토큰(JWT 유사) 유틸과 쿠키 헬퍼
// - 목적: 로그인 성공 시 서버 전체에서 인증 상태를 판단하고 헤더에 반영
// - 보안: HMAC-SHA256으로 서명. 민감정보는 쿠키에 넣지 않고 최소 정보만 보관.

import 'server-only';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache'; // ✅ 추가

const COOKIE_NAME = 'ms_session';
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7일

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

// ✅ JWT 유사 토큰 생성
export function createSessionToken(payload, { maxAge = DEFAULT_MAX_AGE } = {}) {
  const secret = process.env.AUTH_SECRET || 'dev-secret';
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + maxAge, ...payload };
  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(body));
  const s = sign(`${h}.${p}`, secret);
  return `${h}.${p}.${s}`;
}

// ✅ JWT 유사 토큰 검증
export function verifySessionToken(token) {
  try {
    const secret = process.env.AUTH_SECRET || 'dev-secret';
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;

    const expected = sign(`${h}.${p}`, secret);
    const bS = Buffer.from(s);
    const bE = Buffer.from(expected);
    if (bS.length !== bE.length) return null;
    if (!crypto.timingSafeEqual(bS, bE)) return null;

    const payload = JSON.parse(
      Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ✅ 서버 사이드에서 현재 요청의 세션 조회
export async function getSession() {
  noStore(); // ✅ 이 한 줄로 정적 프리렌더 방지 (오류 해결)
  try {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

// ✅ NextResponse 인스턴스에 세션 쿠키 설정
export function setSessionCookieOn(res, token, { maxAge = DEFAULT_MAX_AGE } = {}) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

// ✅ 세션 쿠키 제거
export function clearSessionCookieOn(res) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });
}

export { COOKIE_NAME };
