import { NextResponse } from 'next/server';

let users = [];

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ error: '이메일 또는 비밀번호 오류' }, { status: 401 });
  }

  // JWT 토큰 발급은 추후 추가
  return NextResponse.json({ success: true, user });
}
