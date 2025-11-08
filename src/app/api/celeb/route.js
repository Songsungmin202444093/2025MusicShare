import { q } from "@/lib/db";

export async function GET() {
  const rows = await q(
    `SELECT c.id, c.slug, c.name, c.cover, COUNT(t.id) AS track_count
     FROM celeb c
     LEFT JOIN track t ON t.celeb_id = c.id
     GROUP BY c.id
     ORDER BY c.name`
  );
  return Response.json(rows);
}
