// src/app/api/latest/[id]/route.js
export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET(_req, { params }) {
  const { id } = await params

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

  // 최신 음악 전체 목록 가져오기
  const listRes = await fetch(`${base}/api/latest-tracks`, {
    cache: "no-store",
  })

  if (!listRes.ok) {
    return NextResponse.json(
      { error: "UPSTREAM_ERROR" },
      { status: 500 }
    )
  }

  const list = await listRes.json()

  // latest-tracks 응답에서 id(=유튜브ID) 같은 곡 찾기
  const track = list.find((t) => String(t.id) === String(id))

  if (!track) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }

  // youtube_id 만들기
  let youtubeId = track.youtube_id || track.youtubeId

  if (!youtubeId) {
    if (track.youtubeUrl) {
      try {
        const u = new URL(track.youtubeUrl)
        youtubeId = u.searchParams.get("v") || track.id
      } catch {
        youtubeId = track.id
      }
    } else {
      youtubeId = track.id
    }
  }

  // 상세 페이지에서 쓸 데이터 형태로 응답
  return NextResponse.json({
    id: track.id,
    title: track.title,
    artist: track.artist,
    youtube_id: youtubeId,
    comment: track.comment ?? null,
    source: track.source ?? "YouTube 오늘의 음악",
    publishedAt: track.publishedAt ?? null,
  })
}
