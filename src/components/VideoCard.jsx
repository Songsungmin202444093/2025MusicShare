// 영상/트랙 1개를 보여주는 카드. 클릭 시 상세로 이동.
import Link from "next/link"

export default function VideoCard({ item }) {
  return (
    // Next.js Link로 클라이언트 사이드 전환(빠른 네비게이션)
    <Link href={`/tracks/${item.id}`} className="vcard">
      <div className="vthumb">
        {/* 간단화를 위해 <img> 사용. next/image로 바꾸면 성능↑ */}
        <img src={item.thumb} alt={item.title} />
      </div>

      <div className="vbody">
        {/* 제목 2줄 말줄임은 CSS line-clamp로 처리 */}
        <h3 className="vtitle">{item.title}</h3>
        <p className="vartist">{item.artist}</p>

        {/* 조회수/좋아요 메타 정보 */}
        <div className="vmeta">
          <span>조회수 {item.views.toLocaleString()}</span>
          <span>♥ {item.likes.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}
