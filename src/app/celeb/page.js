import Sidebar from "../../components/Sidebar";
import TagCloud from "../../components/TagCloud";
import Image from "next/image";

const celebTracks = [
  {
    id: 1,
    title: "내적 댄스 보장! 둠칫 노동요",
    dj: "대중가요마스터",
    verified: true,
    count: 200,
    likes: 1987,
    tags: ["노동요", "댄스"],
    thumbnail: "/sample1.jpg"
  },
  {
    id: 2,
    title: "국내 포크 감성",
    dj: "FOLK마스터",
    verified: true,
    count: 59,
    likes: 345,
    tags: ["2020년대", "포크"],
    thumbnail: "/sample2.jpg"
  },
  {
    id: 3,
    title: "가을 감성 발라드 리메이크곡",
    dj: "SoulMuse",
    verified: false,
    count: 138,
    likes: 1021,
    tags: ["가을", "발라드"],
    thumbnail: "/sample3.jpg"
  },
  {
    id: 4,
    title: "애틋해지는 사극 드라마 속 연주곡",
    dj: "OST마스터",
    verified: true,
    count: 42,
    likes: 346,
    tags: ["OST", "연주곡"],
    thumbnail: "/sample4.jpg"
  }
];


export default function CelebPage() {
  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center">
  <div className="max-w-7xl mx-auto py-10 px-2">
          <h1 className="text-3xl font-bold mb-2">투데이</h1>
          <p className="text-lg mb-8">10월 15일 오늘은 뭘 듣지?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {celebTracks.map(track => (
              <div key={track.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{minWidth:'0',maxWidth:'100%',margin:'0 auto'}}>
                <div className="relative w-full" style={{aspectRatio:'1/1', minHeight:'260px'}}>
                  <Image src={track.thumbnail} alt={track.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold mb-3">{track.title}</h2>
                  <div className="flex items-center mb-2">
                    <span className="text-orange-500 font-bold mr-2">DJ {track.dj}</span>
                    {track.verified && <span className="text-green-500 text-xs font-bold">✔</span>}
                  </div>
                  <div className="flex items-center text-base text-gray-500 mb-2">
                    <span className="mr-6">💗 {track.likes.toLocaleString()}</span>
                    <span>{track.count}곡</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {track.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-sm px-3 py-1 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside className="right" style={{display:'none'}}><TagCloud /></aside>
    </main>
  );
}
