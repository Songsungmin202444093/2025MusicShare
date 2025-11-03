// 앱 전역 레이아웃(모든 페이지의 뼈대). App Router에서는 반드시 필요.
import "./globals.css"
import Link from "next/link"
import SearchBar from "../components/SearchBar"
import { getSession } from "@/lib/auth"
// import MusicPlayer from "../components/MusicPlayer"

// 페이지 <head> 기본 메타데이터 (제목/설명)
export const metadata = { title: "MusicShare", description: "Link & Recommend" }

export default async function RootLayout({ children }) {
  // Next.js가 html/body를 이 컴포넌트에서 렌더링함
  const session = await getSession()
  return (
    <html lang="ko">
      <body>
        {/* 상단 고정 헤더 */}
        <header className="header">
          <div className="container header__inner">
            {/* 홈으로 이동하는 로고(간단히 a 태그 사용) */}
            <Link href="/" className="logo">MusicShare</Link>

            {/* 검색 입력창 - 실제 검색 기능 구현 */}
            <SearchBar />

            {/* 우측 계정 영역: 로그인 상태에 따라 분기 */}
            {session ? (
              <div className="account">
                <Link href="/me" className="btn" prefetch={false}>내 정보</Link>
                <a href="/api/auth/logout" className="btn btn--ghost">로그아웃</a>
              </div>
            ) : (
              <Link href="/auth" className="btn">로그인</Link>
            )}
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

  {/* 하단 고정 음악 플레이어 제거됨 */}
      </body>
    </html>
  )
}
