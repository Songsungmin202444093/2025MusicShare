// src/app/celeb/page.js
import Link from "next/link"
import Sidebar from "../../components/Sidebar"
import TagCloud from "../../components/TagCloud"
import Image from "next/image"
import { q } from "@lib/db"
import LikeButton from "../../components/LikeButton.jsx"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function thumbPath(name) {
  return `/celeb/${encodeURIComponent(name)}.png`
}

async function getCelebs() {
  return await q(`
    SELECT
      MIN(cr.id) AS id,
      cr.celeb_name AS name,
      COUNT(*) AS count
    FROM celeb_recommendations cr
    GROUP BY cr.celeb_name
    ORDER BY cr.celeb_name
  `)
}

export default async function CelebPage() {
  const celebs = await getCelebs()

  return (
    <main
      className="grid"
      style={{ gridTemplateColumns: "220px 1fr", gap: "16px" }}
    >
      <aside className="left">
        <Sidebar />
      </aside>

      <section className="center">
        <div className="w-full mx-auto py-10 px-2">
          <h1 className="text-5xl font-extrabold text-center mb-8">
            유명인 추천 음악
          </h1>

          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          >
            {celebs.map((c) => (
              <Link
                key={`${c.name}-${c.id}`}
                href={`/celeb/${encodeURIComponent(c.name)}`}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative w-full bg-gray-100" style={{ aspectRatio: "4 / 3" }}>
                  <Image
                    src={thumbPath(c.name)}
                    alt={c.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="p-5">
                  <div className="text-2xl font-extrabold">{c.name}</div>

                  <div className="flex items-center justify-between mt-4 text-gray-600">
                    <LikeButton celebId={c.name} />
                    <span>{c.count}곡</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <aside className="right" style={{ display: "none" }}>
        <TagCloud />
      </aside>
    </main>
  )
}
