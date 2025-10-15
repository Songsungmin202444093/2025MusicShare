import { NextResponse } from 'next/server';

let users = [];

export async function POST(request) {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return NextResponse.json({ error: '이미 존재하는 이메일' }, { status: 409 });
  }

  users.push({ email, password, name });
  return NextResponse.json({ success: true });
}
