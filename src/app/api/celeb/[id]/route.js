// src/app/api/celeb/[id]/route.js
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { q } from "@lib/db"

export async function GET(_req, context) {
  // ✅ Next 15: params 는 await 필요
  const { id: raw } = await context.params
  const idOrName = decodeURIComponent(String(raw))

  // 숫자면 id → celeb_name 으로 변환
  let celebName = idOrName
  if (/^\d+$/.test(idOrName)) {
    const rows = await q(
      `SELECT celeb_name FROM celeb_recommendations WHERE id=? LIMIT 1`,
      [Number(idOrName)]
    )
    if (!rows.length) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }
    celebName = rows[0].celeb_name
  }

  // 트랙 목록
  const tracks = await q(
    `
    SELECT
    id,
    celeb_name,
    song_title,
    artist,
    comment AS note,
    source,
    youtube
    FROM celeb_recommendations
    WHERE celeb_name = ?
    ORDER BY id
  `, [celebName])

  // 좋아요 (없으면 0)
  const likeRows = await q(
    `SELECT likes FROM celeb_likes WHERE celeb_name=?`,
    [celebName]
  )
  const likes = likeRows[0]?.likes ?? 0

  return NextResponse.json({
    celeb: { name: celebName, cover: null },
    likes,
    tracks,
  })
}
