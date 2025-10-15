// 더미 음악 데이터 (실제 구현 시 DB나 API로 교체 가능)
const tracks = [
  {
    id: "1",
    title: "NewJeans - Get Up",
    artist: "NewJeans",
    views: 1234567,
    likes: 12345,
    youtubeId: "SXM1q0CTfew", // ✅ NewJeans - Get Up 실제 YouTube ID
    tags: ["#hot", "#kpop"]
  },
  {
    id: "2",
    title: "IVE - I AM",
    artist: "IVE",
    views: 856000,
    likes: 9800,
    youtubeId: "6ZUIwj3FgUY",
    tags: ["#trend", "#kpop"]
  },
  {
    id: "3",
    title: "SEVENTEEN - God of Music",
    artist: "SEVENTEEN",
    views: 967000,
    likes: 11800,
    youtubeId: "zSQ48zyWZrY",
    tags: ["#idol"]
  },
  {
    id: "4",
    title: "ITZY - CAKE",
    artist: "ITZY",
    views: 892000,
    likes: 9200,
    youtubeId: "0bIRwBpBcZQ", 
    tags: ["#dance"]
  },
  {
    id: "5",
    title: "(G)I-DLE - Queencard",
    artist: "(G)I-DLE",
    views: 1150000,
    likes: 15300,
    youtubeId: "7HDeem-JaSY",
    tags: ["#hot"]
  }
]

// 네트워크 지연 시뮬레이션용 (로딩 상태 테스트 가능)
export async function getTracks() {
  await new Promise((r) => setTimeout(r, 150))
  return tracks
}

// 단일 트랙(ID로 검색)
export async function getTrack(id) {
  return (await getTracks()).find((x) => x.id === id) || null
}
