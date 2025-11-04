// app/tracks/[id]/page.js
// 목적: 단일 트랙을 DB에서 읽어 상세 표시 + 유튜브 임베드
export const runtime = 'nodejs'
import { getTrack } from '../../../lib/tracks'

export default async function TrackPage({ params }) {
  const { id } = await params
  const item = await getTrack(id)
  if (!item) return <div className="empty">존재하지 않는 항목입니다.</div>

  return (
    <div className="detail">
      <div className="thumb"><img src={item.thumb} alt={item.title} /></div>
      <h1 className="title">{item.title}</h1>
      <p className="meta">
        {item.artist} · 조회수 {item.views.toLocaleString()} · ♥ {item.likes.toLocaleString()}
      </p>
      <div style={{marginTop:12}}>
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
