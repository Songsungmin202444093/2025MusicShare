import Sidebar from "@/components/Sidebar"
import PopularMusicList from "@/components/PopularMusicList"

export default function PopularPage() {
  return (
    <main
      className="grid"
      style={{ gridTemplateColumns: "220px 1fr", gap: "16px" }}
    >
      {/* 사이드바 */}
      <aside className="left">
        <Sidebar />
      </aside>

      {/* 오른쪽 콘텐츠 */}
      <section className="center">
        {/* 제목 + 설명 */}
        <div style={{ maxWidth: "760px", marginLeft: "50px" }}>
          
          <h1
            className="text-4xl font-extrabold mb-4"
            style={{
              marginTop: "40px"   // ⭐ 여기! 제목만 아래로 이동
            }}
          >
            인기 음악
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "40px"
            }}
          >
            유튜브 기준으로 지금 인기 있는 음악 영상들을 모았어요.
          </p>
        </div>

        {/* 차트(표)는 그대로 */}
        <div style={{ maxWidth: "760px" }}>
          <PopularMusicList />
        </div>
      </section>
    </main>
  )
}
