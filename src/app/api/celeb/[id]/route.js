// app/api/celeb/[id]/route.js
import { q } from "@lib/db";

export async function GET(_req, { params }) {
  const id = params.id;

  // 1. 유명인 기본 정보 조회
  const celebs = await q(
    `SELECT id, slug, name, cover FROM celeb WHERE slug=?`, 
    [id] // id값으로 slug 찾음 (아이유 → 'iu')
  );

  if (celebs.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const celeb = celebs[0];

  // 2. 해당 유명인의 추천곡 목록
  const tracks = await q(
    `SELECT id, title, artist, album, note, source, youtube, thumb, likes
     FROM track
     WHERE celeb_id=? 
     ORDER BY id`, 
    [celeb.id]
  );

  return Response.json({ celeb, tracks });
}
