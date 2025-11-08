export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        celeb_name AS name,
        COUNT(*) AS count,
        FLOOR(1000 + RAND() * 2000) AS likes
      FROM celeb_recommendations
      GROUP BY celeb_name
      ORDER BY celeb_name
    `)
    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return new NextResponse("DB_ERROR", { status: 500 })
  }
}
