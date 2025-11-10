// src/app/celeb/[id]/page.js
import { headers } from "next/headers"
import LikeButton from "../../../components/LikeButton.jsx"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function abs(path) {
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host  = h.get("x-forwarded-host") ?? h.get("host")
  return `${proto}://${host}${path}`
}

function coverPath(displayName) {
  return `/celeb/${encodeURIComponent(displayName)}.png`
}

function ytId(u = "") {
  const s = String(u)
  return (
    s.match(/v=([^&]+)/)?.[1] ||
    s.match(/youtu\.be\/([^?]+)/)?.[1] ||
    s.match(/shorts\/([^?]+)/)?.[1] ||
    s.match(/embed\/([^?]+)/)?.[1] || ""
  )
}
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`
const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`

async function CelebDetailBody({ id }) {
  const url = await abs(`/api/celeb/${id}`)
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return <div className="empty">존재하지 않는 페이지입니다.</div>

  const data = await res.json()

  const displayName =
    data?.celeb?.name
      ? decodeURIComponent(String(data.celeb.name))
      : decodeURIComponent(String(id))

  const profileCover =
    (data?.celeb?.cover && String(data.celeb.cover).trim()) ||
    coverPath(displayName)

  const tracks = data.tracks ?? data

  return (
    <div className="container" style={{ padding: "14px 0" }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "linear-gradient(90deg,#f7f3f6,#eef1f7)" }}>
          <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src={profileCover} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>{displayName}</div>
              <LikeButton celebId={data?.celeb?.id ?? data?.celeb?.slug ?? data?.celeb?.name ?? id} />
            </div>
            <div style={{ color: "var(--muted)" }}>요즘 듣는 플레이리스트</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12, padding: 0 }}>
        <div className="card__title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>추천곡</div>

        <div style={{ display: "grid", gridTemplateColumns: "64px 200px 1fr 260px 200px", gap: 10, padding: "10px 16px", color: "var(--muted)", fontSize: 13 }}>
          <div>번호</div>
          <div>곡정보</div>
          <div>언급 내용</div>
          <div style={{ textAlign: "left" }}>아티스트 · 앨범</div>
          <div>출처</div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }} />

        {tracks.map((row, idx) => {
          const idY = ytId(row.youtube)
          return (
            <div key={row.id ?? `${id}-${idx}`} style={{ display: "grid", gridTemplateColumns: "64px 200px 1fr 260px 200px", gap: 10, alignItems: "center", padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 700 }}>{idx + 1}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {row.youtube && idY ? (
                  <a href={ytWatch(idY)} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", borderRadius: 10, overflow: "hidden" }} title="유튜브에서 보기">
                    <img src={ytThumb(idY)} alt="" style={{ width: 130, height: 130, objectFit: "cover", display: "block" }} />
                  </a>
                ) : (
                  <div style={{ width: 130, height: 130, borderRadius: 10, overflow: "hidden" }}>
                    <img src={profileCover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>
              <div style={{ color: "#333", lineHeight: 1.6, fontSize: 15 }}>{row.note ?? row.comment}</div>
              <div style={{ color: "var(--muted)", fontSize: 15, whiteSpace: "nowrap" }}>
                {(row.artist ?? "") + (row.album ? ` · ${row.album}` : "")}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 15 }}>{row.source}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <a href="/celeb" className="btn btn--ghost">목록으로</a>
      </div>
    </div>
  )
}

export default async function CelebDetail(props) {
  const { id } = await props.params
  return <CelebDetailBody id={id} />
}
