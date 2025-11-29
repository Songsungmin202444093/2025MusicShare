// src/app/popular/page.js
import Link from "next/link"
import Sidebar from "@/components/Sidebar"
import { q } from "@lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function getPopularTracks() {
  return await q(`
    SELECT id, title, artist, thumb
    FROM tracks
    ORDER BY views DESC
    LIMIT 20
  `)
}

export default async function PopularPage() {
  const tracks = await getPopularTracks()

  return (
    <main
      className="grid"
      style={{ gridTemplateColumns: "220px 1fr", gap: 16 }}
    >
      <aside>
        <Sidebar />
      </aside>

      <section className="center w-full p-6">
        <h1 className="text-4xl font-extrabold mb-8">인기 음악</h1>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {tracks.map((track) => (
            <Link
              key={track.id}
              href={`/popular/${track.id}`}   // ← 요게 4번에서 말한 부분!
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                <img
                  src={track.thumb}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="font-bold text-lg">{track.title}</div>
                <div className="text-gray-600 text-sm">{track.artist}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
