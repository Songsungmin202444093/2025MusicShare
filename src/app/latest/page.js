import Sidebar from "@/components/Sidebar"
import LatestMusicList from "@/components/LatestMusicList"

export default function LatestPage() {
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
              marginTop: "40px"
            }}
          >
            오늘의 음악
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "40px"
            }}
          >
            최근 3개월 내 조회수가 급상승한 인기 음악들을 모았어요.
          </p>
        </div>

        {/* 차트(표)는 그대로 */}
        <div style={{ maxWidth: "760px" }}>
          <LatestMusicList />
        </div>
      </section>
    </main>
  )
}
