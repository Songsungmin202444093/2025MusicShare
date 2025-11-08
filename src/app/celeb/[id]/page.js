export const runtime = "nodejs";

async function CelebDetailBody({ id }) {
  // ✅ fetch는 여기 안에서 실행 (params.id 전달받음)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/celeb/${id}`, { cache: "no-store" });
  if (!res.ok) return <div className="empty">존재하지 않는 페이지입니다.</div>;
  const { celeb, tracks } = await res.json();

  return (
    <div className="container" style={{ padding: "14px 0" }}>
      {/* 상단 카드 */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "linear-gradient(90deg,#f7f3f6,#eef1f7)" }}>
          <div style={{ width: 72, height: 72, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src={celeb.cover || "/sample1.jpg"} alt={celeb.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>{celeb.name}</div>
            <div style={{ color: "var(--muted)" }}>요즘 듣는 플레이리스트</div>
          </div>
        </div>
      </div>

      {/* 추천곡 리스트 */}
      <div className="card" style={{ marginTop: 12, padding: 0 }}>
        <div className="card__title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>추천곡</div>

        {/* 테이블 헤더 */}
        <div style={{ display: "grid", gridTemplateColumns: "64px 200px 1fr 260px 200px", gap: 10, padding: "10px 16px", color: "var(--muted)", fontSize: 13 }}>
          <div>번호</div>
          <div>곡정보</div>
          <div>언급 내용</div>
          <div style={{ textAlign: "left" }}>아티스트 · 앨범</div>
          <div>출처</div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }} />

        {/* 실제 곡 목록 */}
        {tracks.map((row, idx) => (
          <div key={row.id} style={{ display: "grid", gridTemplateColumns: "64px 200px 1fr 260px 200px", gap: 10, alignItems: "center", padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700 }}>{idx + 1}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {row.youtube ? (
                <a href={row.youtube} target="_blank" rel="noreferrer" style={{ display: "inline-block", borderRadius: 10, overflow: "hidden" }}>
                  <img src={row.thumb || "/sample1.jpg"} alt="" style={{ width: 130, height: 130, objectFit: "cover", display: "block" }} />
                </a>
              ) : (
                <div style={{ width: 130, height: 130, borderRadius: 10, overflow: "hidden" }}>
                  <img src={row.thumb || "/sample1.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
            <div style={{ color: "#333", lineHeight: 1.6, fontSize: 15 }}>{row.note}</div>
            <div style={{ color: "var(--muted)", fontSize: 15, whiteSpace: "nowrap" }}>{`${row.artist} · ${row.album || ""}`}</div>
            <div style={{ color: "var(--muted)", fontSize: 15 }}>{row.source}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <a href="/celeb" className="btn btn--ghost">목록으로</a>
      </div>
    </div>
  );
}

// ✅ 최상단 함수에서는 fetch 하지 않고, id를 전달만 함
export default function CelebDetail({ params }) {
  const id = params.id;
  return <CelebDetailBody id={id} />;
}
