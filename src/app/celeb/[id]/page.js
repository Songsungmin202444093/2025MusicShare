// app/celeb/[id]/page.js
export const runtime = "nodejs";

const DATA = {
  iu: {
    name: "아이유",
    cover: "/아이유.png",
    list: [
      {
        no: 1,
        artist: "이적",
        album: "나의 아저씨 OST",
        note:
          "콘서트와 방송에서 마음이 힘들 때 자주 듣는다고 언급. 위로가 필요한 순간마다 다시 찾는 곡으로 소개.",
        source: "tvN·유튜브 인터뷰",
        youtube: "https://www.youtube.com/watch?v=gPgxBHRA0lc",
        thumb: "https://img.youtube.com/vi/gPgxBHRA0lc/hqdefault.jpg",
      },
    ],
  },
  yjs: { name: "유재석", cover: "/yjs.jpg", list: [] },
  jay: { name: "박재범", cover: "/jaypark.jpg", list: [] },
  yerin: { name: "백예린", cover: "/yerin.jpg", list: [] },
  jk: { name: "정국 (BTS)", cover: "/jk.jpg", list: [] },
};

// ✅ async 제거 (params 경고 해결)
export default function CelebDetail({ params }) {
  const item = DATA[params.id];
  if (!item) return <div className="empty">존재하지 않는 페이지입니다.</div>;

  return (
    <div className="container" style={{ padding: "14px 0" }}>
      {/* 상단 프로필 */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 16,
            background: "linear-gradient(90deg,#f7f3f6,#eef1f7)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid var(--line)",
            }}
          >
            <img
              src={item.cover || "/sample1.jpg"}
              alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>
              {item.name}
            </div>
            <div style={{ color: "var(--muted)" }}>요즘 듣는 플레이리스트</div>
          </div>
        </div>
      </div>

      {/* 추천곡 테이블 */}
      <div className="card" style={{ marginTop: 12, padding: 0 }}>
        <div
          className="card__title"
          style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}
        >
          추천곡
        </div>

        {/* 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "64px 220px 1fr 260px 200px",
            gap: 12,
            padding: "10px 16px",
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          <div>번호</div>
          <div>곡정보</div>
          <div>언급 내용</div>
          <div style={{ textAlign: "left" }}>아티스트 · 앨범</div>
          <div>출처</div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }} />

        {/* 리스트 */}
        {item.list.map((row) => {
          const link = row.youtube || null;
          return (
            <div
              key={row.no}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 220px 1fr 260px 200px",
                gap: 12,
                alignItems: "center",
                padding: "16px 16px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div style={{ fontWeight: 700 }}>{row.no}</div>

              {/* 썸네일 (테두리/배경 제거) */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={row.thumb || "/sample1.jpg"}
                      alt=""
                      style={{
                        width: 180,
                        height: 180,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </a>
                ) : (
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={row.thumb || "/sample1.jpg"}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ color: "#333", lineHeight: 1.7, fontSize: 15 }}>
                {row.note}
              </div>

              <div style={{ color: "var(--muted)", fontSize: 15, whiteSpace: "nowrap" }}>
                {`${row.artist} · ${row.album}`}
              </div>

              <div style={{ color: "var(--muted)", fontSize: 15 }}>{row.source}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <a href="/celeb" className="btn btn--ghost">
          목록으로
        </a>
      </div>
    </div>
  );
}
