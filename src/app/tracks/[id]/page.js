// 동적 라우트 예: /tracks/1
import { getTrack } from "../../../lib/data"

// 페이지별 <head> 정보 동적 생성 (SEO/공유용 제목)
export async function generateMetadata({ params }) {
  const item = await getTrack(params.id)
  return { title: item ? `${item.title} | MusicShare` : "MusicShare" }
}

export default async function TrackPage({ params }) {
  // URL의 [id] 값을 사용해 단일 곡 데이터 조회
  const item = await getTrack(params.id)
  if (!item) return <div className="empty">존재하지 않는 항목입니다.</div>

  // 상세 페이지: 유튜브 영상만 임베드로 표시
  return (
    <div className="detail" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div style={{width:'100%',maxWidth:'640px',aspectRatio:'16/9',border:'4px solid #e53e3e',borderRadius:'16px',overflow:'hidden',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <h1 className="title" style={{marginTop:'24px'}}>{item.title}</h1>
      <p className="meta">{item.artist}</p>
      <p className="meta">조회수 {item.views.toLocaleString()} · ♥ {item.likes.toLocaleString()}</p>
    </div>
  )
}
