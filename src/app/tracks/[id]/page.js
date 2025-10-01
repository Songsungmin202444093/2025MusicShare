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

  // 간단한 상세 화면(썸네일/제목/아티스트/메타/외부 링크)
  return (
    <div className="detail">
      <div className="thumb">
        {/* next/image 대신 img 사용(초기 템플릿 단순화) */}
        <img src={item.thumb} alt={item.title} />
      </div>

      <h1 className="title">{item.title}</h1>
      <p className="meta">{item.artist}</p>

      <p className="meta">
        조회수 {item.views.toLocaleString()} · ♥ {item.likes.toLocaleString()}
      </p>

      {/* 이후 실제 유튜브 URL을 href에 연결 */}
      <a className="btn" href="#">YouTube에서 듣기</a>
    </div>
  )
}
