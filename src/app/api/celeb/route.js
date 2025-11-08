// src/app/api/celeb/route.js
import { q } from "../../../lib/db";

export async function GET() {
  const rows = await q(`
    SELECT id, celeb_name, song_title, artist, comment, source
    FROM celeb_recommendations
    ORDER BY celeb_name
  `);
  return Response.json(rows);
}
