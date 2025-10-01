// 홈 페이지(루트 /). 서버 컴포넌트 기본값이라 데이터 패칭을 직접 await 가능.
import Sidebar from "../components/Sidebar"
import TagCloud from "../components/TagCloud"
import FeedGrid from "../components/FeedGrid"
import { getTracks } from "../lib/data" // 더미 데이터 로더

export default async function Page() {
  // 서버에서 더미 데이터를 불러옴(실제 API로 대체 가능)
  const items = await getTracks()

  // 3열 레이아웃: 좌(사이드바) / 중앙(카드 그리드) / 우(태그 카드)
  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center"><FeedGrid items={items} /></section>
      <aside className="right"><TagCloud /></aside>
    </main>
  )
}
