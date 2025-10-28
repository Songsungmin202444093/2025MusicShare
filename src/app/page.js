// app/page.js
// 목적: 더미(data.js) 대신 DB 데이터로 카드 렌더
export const runtime = 'nodejs'
import Sidebar from "../components/Sidebar"
import TagCloud from "../components/TagCloud"
import FeedGrid from "../components/FeedGrid"
import { getTracks } from "../lib/tracks"

export default async function Page() {
  const items = await getTracks() // 서버 컴포넌트라 바로 await 가능
  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center"><FeedGrid items={items} /></section>
      <aside className="right"><TagCloud /></aside>
    </main>
  )
}
