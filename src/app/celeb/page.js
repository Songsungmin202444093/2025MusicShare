import Link from "next/link"
import Sidebar from "../../components/Sidebar"
import TagCloud from "../../components/TagCloud"
import Image from "next/image"

const celebs = [
  { id:"iu", name:"아이유", likes:2100, count:1, thumb:"/아이유.png" },
  { id:"yjs", name:"유재석", likes:1850, count:1, thumb:"/유재석.png" },
  { id:"jaypark", name:"박재범", likes:1528, count:1, thumb:"/박재범.png" },
  { id:"baekyerin", name:"백예린", likes:1700, count:1, thumb:"/백예린.png" },
  { id:"jungkook", name:"정국(BTS)", likes:2500, count:1, thumb:"/정국.png" }
]

export default function CelebPage() {
  return (
    // ★ 이 페이지만 그리드를 2열로 강제 (오른쪽 열 제거)
    <main className="grid" style={{ gridTemplateColumns: '220px 1fr', gap: '16px' }}>
      <aside className="left"><Sidebar /></aside>

      <section className="center">
        {/* 폭 제한 제거 */}
        <div className="w-full mx-auto py-10 px-2">
          <h1 className="text-5xl font-extrabold text-center mb-8">유명인 추천 음악</h1>

          {/* ★ 줄당 4개 고정, 카드 크기 유지(4:3) */}
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {celebs.map(c => (
              <Link
                key={c.id}
                href={`/celeb/${c.id}`}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
                  <Image src={c.thumb} alt={c.name} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-2xl font-extrabold">{c.name}</div>
                  <div className="flex items-center justify-between mt-4 text-gray-600">
                    <span className="flex items-center gap-2">💗 {Number(c.likes).toLocaleString()}</span>
                    <span>{c.count}곡</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 오른쪽 열은 아예 렌더링하지 않거나, 남겨도 됨(지금은 숨김) */}
      <aside className="right" style={{ display: 'none' }}><TagCloud /></aside>
    </main>
  )
}
