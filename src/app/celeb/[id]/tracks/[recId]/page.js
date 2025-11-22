// src/app/celeb/[id]/tracks/[recId]/page.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

async function abs(path) {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${proto}://${host}${path}`
}

function coverPath(name) {
  return `/celeb/${encodeURIComponent(name)}.png`
}

function ytId(u = '') {
  const s = String(u)
  return (
    s.match(/v=([^&]+)/)?.[1] ||
    s.match(/youtu\.be\/([^?]+)/)?.[1] ||
    s.match(/shorts\/([^?]+)/)?.[1] ||
    s.match(/embed\/([^?]+)/)?.[1] ||
    ''
  )
}

export default async function CelebTrackDetailPage({ params }) {
  const { id, recId } = params

  const url = await abs(`/api/celeb/${id}`)
  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    return (
      <main className="grid">
        <aside className="left"><Sidebar /></aside>
        <section className="center">
          <div className="card">존재하지 않는 페이지입니다.</div>
        </section>
      </main>
    )
  }

  const data = await res.json()

  const displayName =
    data?.celeb?.name
      ? decodeURIComponent(String(data.celeb.name))
      : decodeURIComponent(String(id))

  const profileCover =
    (data?.celeb?.cover && String(data.celeb.cover).trim()) ||
    coverPath(displayName)

  const tracks = data.tracks ?? data
  const track = tracks.find(t => String(t.id) === String(recId))

  if (!track) {
    return (
      <main className="grid">
        <aside className="left"><Sidebar /></aside>
        <section className="center">
          <div className="card">추천곡을 찾을 수 없습니다.</div>
          <div style={{ marginTop: 12 }}>
            <Link
              href={`/celeb/${encodeURIComponent(displayName)}`}
              className="btn btn--ghost"
            >
              목록으로
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const youtubeId = ytId(track.youtube || track.youtubeId || '')

  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>

      <section className="center">
        <div className="container" style={{ padding: '14px 0' }}>

          {/* 상단 프로필 */}
          <div
            className="card"
            style={{
              marginBottom: 24,
              padding: 0,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: 16,
                background: 'linear-gradient(90deg,#f7f3f6,#eef1f7)'
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1px solid var(--line)'
                }}
              >
                <img
                  src={profileCover}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">유명인 추천 플레이리스트</div>
                <h1 className="text-3xl font-extrabold mb-2">{displayName}</h1>
              </div>
            </div>
          </div>

          {/* 2단 레이아웃 */}
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.2fr)', // 왼쪽(영상) 폭 더 넓게
              alignItems: 'stretch'
            }}
          >
            {/* 왼쪽: 유튜브 플레이어만 */}
            <div className="card" style={{ padding: 20 }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#000'
                }}
              >
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={track.title ?? track.track_title ?? ''}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                  />
                ) : (
                  <img
                    src={profileCover}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            </div>

            {/* 오른쪽: 언급 내용 + 출처만 */}
            <div className="card" style={{ padding: 24 }}>
              <div className="card__title" style={{ marginBottom: 16 }}>
                언급 내용
              </div>

              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>
                {track.note ?? track.comment ?? ''}
              </p>

              <div className="text-sm text-gray-500 mb-1">출처</div>
              <div className="text-base text-gray-700">
                {track.source || track.source_label || '-'}
              </div>
            </div>
          </div>

          {/* 맨 아래 버튼 */}
          <div style={{ marginTop: 28 }}>
            <Link
              href={`/celeb/${encodeURIComponent(displayName)}`}
              className="btn btn--ghost"
            >
              목록으로
            </Link>
          </div>

        </div>
      </section>
    </main>
  )
}
