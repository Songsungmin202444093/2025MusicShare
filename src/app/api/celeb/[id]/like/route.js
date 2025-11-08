// src/app/api/celeb/[id]/like/route.js
export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { q } from "@lib/db"

export async function POST(_req, { params }) {
  const id = Number(params.id)
  const rows = await q(`SELECT celeb_name FROM celeb_recommendations WHERE id=? LIMIT 1`, [id])
  if (!rows.length) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  const name = rows[0].celeb_name
  await q(`INSERT INTO celeb_likes (celeb_name, likes) VALUES (?,1)
           ON DUPLICATE KEY UPDATE likes = likes + 1`, [name])
  const [{ likes }] = await q(`SELECT likes FROM celeb_likes WHERE celeb_name=?`, [name])
  return NextResponse.json({ celeb: name, likes })
}
