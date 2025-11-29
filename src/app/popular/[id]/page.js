// src/app/popular/[id]/page.js
import Sidebar from "@/components/Sidebar"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function PopularDetail({ id }) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

  const res = await fetch(`${base}/api/popular/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return (
      <main className="p-10 text-center text-xl">
        존재하지 않는 곡입니다.
      </main>
    )
  }

  const track = await res.json()
  const embedUrl = `https://www.youtube.com/embed/${track.youtube_id}`

  return (
    <main
      className="grid"
      style={{ gridTemplateColumns: "220px 1fr", gap: 16 }}
    >
      <aside>
        <Sidebar />
      </aside>

      <section className="center w-full p-6">
        <h1 className="text-4xl font-extrabold mb-8">
          인기 음악 · {track.title}
        </h1>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "3fr 2fr" }}
        >
          <div className="bg-white rounded-2xl shadow p-4">
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                title={track.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">곡 정보</h2>
            <p className="font-semibold mb-1">{track.title}</p>
            <p className="text-gray-600 mb-4">{track.artist}</p>
            {track.comment && (
              <>
                <h3 className="font-semibold mb-2">소개</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {track.comment}
                </p>
              </>
            )}
            {track.source && (
              <p className="text-sm text-gray-500 mt-4">
                출처: {track.source}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function Page({ params }) {
  const { id } = await params
  return <PopularDetail id={id} />
}
