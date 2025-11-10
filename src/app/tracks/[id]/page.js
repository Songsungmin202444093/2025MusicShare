'use client'
export const runtime = 'nodejs'
import { useEffect, useState } from 'react'
import { getTrack } from '../../../lib/tracks'

export default async function TrackPage({ params }) {
  const { id } = await params
  const item = await getTrack(id)
  if (!item) return <div className="empty">존재하지 않는 항목입니다.</div>
  return <TrackDetail item={item} />
}

function TrackDetail({ item }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(item.likes)

  useEffect(() => {
    fetch(`/api/likes/${item.id}`)
      .then(r => r.json())
      .then(d => setLiked(d.liked))
      .catch(() => setLiked(false))
  }, [item.id])

  const toggleLike = async () => {
    const res = await fetch(`/api/likes/${item.id}`, { method: 'POST' })
    if (res.status === 401) {
      alert('로그인 후 이용해주세요.')
      location.href = '/auth'
      return
    }
    const data = await res.json()
    setLiked(data.liked)
    setCount(c => c + (data.liked ? 1 : -1))
  }

  return (
    <div className="detail">
      <div className="thumb"><img src={item.thumb} alt={item.title} /></div>
      <h1 className="title">{item.title}</h1>
      <p className="meta">
        {item.artist} · 조회수 {item.views.toLocaleString()} · ♥ {count.toLocaleString()}
      </p>

      <button
        onClick={toggleLike}
        style={{
          background: liked ? '#e53e3e' : '#fff',
          color: liked ? '#fff' : '#e53e3e',
          border: '1px solid #e53e3e',
          borderRadius: '8px',
          padding: '6px 14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        {liked ? '좋아요 취소' : '좋아요'}
      </button>

      <div style={{ marginTop: 16 }}>
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          allowFullScreen
        />
      </div>
    </div>
  )
}
