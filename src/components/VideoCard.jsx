// 영상/트랙 1개를 보여주는 카드 컴포넌트
// props로 전달된 item 객체의 정보(제목, 아티스트, 유튜브 ID 등)를 표시함
import Link from "next/link"

export default function VideoCard({ item }) {
  // ✅ 유튜브 썸네일 주소를 youtubeId로부터 동적으로 생성
  // 예: https://img.youtube.com/vi/6ZUIwj3FgUY/hqdefault.jpg
  const thumb = item.youtubeId
    ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
    // youtubeId가 없는 경우 대체 이미지 사용
    : (item.thumb ?? "https://placehold.co/640x360?text=No+Thumbnail")

  return (
    // ✅ Next.js의 Link로 페이지 이동 시 클라이언트 전환(빠른 탐색)
    <Link href={`/tracks/${item.id}`} className="vcard">
      {/* 썸네일 영역 */}
      <div
        className="vthumb"
        style={{
          border: "4px solid #e53e3e",     // 썸네일 테두리 색상
          borderRadius: "12px",            // 모서리 둥글게
          overflow: "hidden"               // 이미지가 영역 밖으로 안나가게
        }}
      >
        {/* 실제 썸네일 이미지 */}
        <img src={thumb} alt={item.title} />
      </div>

      {/* 카드 내부 본문 영역 */}
      <div className="vbody">
        {/* 곡 제목 (2줄 말줄임은 CSS line-clamp로 처리) */}
        <h3 className="vtitle">{item.title}</h3>

        {/* 아티스트 이름 */}
        <p className="vartist">{item.artist}</p>

        {/* 조회수 / 좋아요 표시 */}
        <div className="vmeta">
          {/* toLocaleString()을 사용해 숫자를 1,234 형식으로 출력 */}
          <span>조회수 {Number(item.views).toLocaleString()}</span>
          <span>♥ {Number(item.likes).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}
