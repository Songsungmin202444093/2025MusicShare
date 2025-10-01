// 앱 전역 레이아웃(모든 페이지의 뼈대). App Router에서는 반드시 필요.
import "./globals.css"

// 페이지 <head> 기본 메타데이터 (제목/설명)
export const metadata = { title: "MusicShare", description: "Link & Recommend" }

export default function RootLayout({ children }) {
  // Next.js가 html/body를 이 컴포넌트에서 렌더링함
  return (
    <html lang="ko">
      <body>
        {/* 상단 고정 헤더 */}
        <header className="header">
          <div className="container header__inner">
            {/* 홈으로 이동하는 로고(간단히 a 태그 사용) */}
            <a href="/" className="logo">MusicShare</a>

            {/* 검색 입력창 - 아직 동작은 없음(나중에 /search로 연결) */}
            <input className="search" placeholder="아티스트, 노래를 검색하세요…" />

            {/* 회원가입 버튼(추후 라우팅 연결 예정) */}
            <button className="btn">회원가입</button>
          </div>
        </header>

        {/* 각 페이지가 이곳에 렌더링됨 */}
        <div className="container main">{children}</div>

        {/* 하단 푸터 */}
        <footer className="footer">
          <div className="container footer__inner">
            <span>© 2025 MusicShare</span>
            <nav className="links">
              <a href="#">이용약관</a>
              <a href="#">개인정보</a>
              <a href="#">문의</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
