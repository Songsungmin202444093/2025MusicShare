// src/app/api/celeb/[id]/route.js
import { q } from "../../../../lib/db";

export async function GET(_req, { params }) {
  const id = decodeURIComponent(params.id);
  const celeb = await q(
    `SELECT celeb_name, song_title, artist, comment, source
     FROM celeb_recommendations
     WHERE celeb_name = ?`,
    [id]
  );

  if (celeb.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(celeb);
}
