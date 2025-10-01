// 좌측 메뉴. 나중에 실제 라우팅(/popular 등)으로 연결 가능.
const menus = ["AI 추천","최신음악","많이봄","인기차트","TOP 100","K-POP","POP","발라드"]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        {menus.map(m => (
          <li key={m}>
            {/* 현재는 더미 링크. 추후 a → Link로 교체 권장 */}
            <a href="#">{m}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
