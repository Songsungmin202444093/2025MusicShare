"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function PopularMusicList() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/popular-tracks")
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!cancelled) {
          setTracks(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 28px",
          borderRadius: 24,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          fontSize: 14,
          color: "#6b7280"
        }}
      >
        인기 음악을 불러오는 중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 28px",
          borderRadius: 24,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
          fontSize: 14
        }}
      >
        인기 음악을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  if (!tracks.length) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "24px 28px",
          borderRadius: 24,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          fontSize: 14,
          color: "#6b7280"
        }}
      >
        표시할 인기 음악이 없습니다.
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 28px 16px",
        borderRadius: 24,
        background: "#fff",
        boxShadow: "0 10px 30px rgba(15,23,42,0.04)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          YouTube 인기 음악 Top {tracks.length}
        </div>
        <div
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            background: "#f3f4ff",
            color: "#4338ca",
            fontWeight: 600
          }}
        >
          실시간 트렌딩
        </div>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tracks.map((t, index) => (
          <li
            key={t.id}
            style={{
              borderRadius: 16,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              transition: "all .18s ease",
              marginBottom: 4
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#f9fafb"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <Link
              href={`/popular/${t.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flex: 1,
                minWidth: 0,
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div
                style={{
                  width: 26,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  color: index < 3 ? "#ef4444" : "#4b5563"
                }}
              >
                {index + 1}
              </div>

              {t.thumbnail && (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: "0 6px 16px rgba(15,23,42,0.15)"
                  }}
                >
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 4
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {t.artist}
                </div>
              </div>
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#6b7280"
              }}
              onClick={() => {
                if (t.youtubeUrl)
                  window.open(
                    t.youtubeUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
              }}
            >
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  fontWeight: 500
                }}
              >
                YouTube
              </span>
              <span style={{ fontSize: 16 }}>↗</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
