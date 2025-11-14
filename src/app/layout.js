export const dynamic = 'force-dynamic';
export const revalidate = 0;

import "./globals.css";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import { getSession } from "../lib/auth";

export const metadata = { title: "MusicShare", description: "Link & Recommend" };

export default async function RootLayout({ children }) {
  const session = await getSession();
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="container header__inner">
            <Link href="/" className="logo">MusicShare</Link>
            <SearchBar />
            {session ? (
              <div className="account">
                <Link href="/me/posts" className="btn btn--icon" prefetch={false} title="내 게시물">
                  📋
                </Link>
                <Link href="/me/comments" className="btn btn--icon" prefetch={false} title="내 댓글">
                  💬
                </Link>
                <Link href="/celeb/favorites" className="btn btn--icon" prefetch={false} title="즐겨찾기한 유명인">
                  ❤️
                </Link>
                <Link href="/me" className="btn" prefetch={false}>내 정보</Link>
                <a href="/api/auth/logout" className="btn btn--ghost">로그아웃</a>
              </div>
            ) : (
              <Link href="/auth" className="btn">로그인</Link>
            )}
          </div>
        </header>

        <div className="container main">{children}</div>

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
  );
}
