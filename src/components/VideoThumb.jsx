"use client"
import { useState, useMemo } from "react"

function ytId(u) {
  if (!u) return ""
  const s = String(u)
  const m1 = s.match(/v=([^&]+)/)
  const m2 = s.match(/youtu\.be\/([^?]+)/)
  const m3 = s.match(/shorts\/([^?]+)/)
  const m4 = s.match(/embed\/([^?]+)/)
  return m1?.[1] || m2?.[1] || m3?.[1] || m4?.[1] || ""
}

export default function VideoThumb({ url, width = 130, height = 130 }) {
  const id = useMemo(() => ytId(url), [url])
  const [play, setPlay] = useState(false)
  if (!id) return null
  const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`

  return play ? (
    <iframe
      width={width}
      height={height}
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{ borderRadius: 10, border: "0", display: "block" }}
    />
  ) : (
    <button onClick={() => setPlay(true)} style={{ border: 0, padding: 0, borderRadius: 10, overflow: "hidden" }}>
      <img src={thumb} alt="" width={width} height={height} style={{ display: "block", objectFit: "cover" }} />
    </button>
  )
}
