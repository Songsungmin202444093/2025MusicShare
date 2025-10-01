// 임시 더미 데이터. 실제로는 DB나 외부 API를 호출해 대체.
// 개발 초기에는 UI를 먼저 만들기 위해 이렇게 시작하는 게 좋음.
const tracks = [
  { id:"1", title:"NewJeans - Get Up", artist:"NewJeans", views:1234567, likes:12345, thumb:"https://picsum.photos/seed/nj/640/360", tags:["#hot","#kpop"] },
  { id:"2", title:"IVE - I AM",        artist:"IVE",      views:856000,  likes:9800,  thumb:"https://picsum.photos/seed/ive/640/360",  tags:["#trend","#kpop"] },
  { id:"3", title:"SEVENTEEN - God of Music", artist:"SEVENTEEN", views:967000, likes:11800, thumb:"https://picsum.photos/seed/svt/640/360", tags:["#idol"] },
  { id:"4", title:"ITZY - CAKE",       artist:"ITZY",     views:892000,  likes:9200,  thumb:"https://picsum.photos/seed/itzy/640/360", tags:["#dance"] },
  { id:"5", title:"(G)I-DLE - Queencard", artist:"(G)I-DLE", views:1150000, likes:15300, thumb:"https://picsum.photos/seed/idle/640/360", tags:["#hot"] }
]

// 네트워크 지연처럼 보이게 약간의 delay를 줌(로딩 상태 테스트 가능)
export async function getTracks() {
  await new Promise(r => setTimeout(r, 150))
  return tracks
}

// id로 단일 항목 조회
export async function getTrack(id) {
  return (await getTracks()).find(x => x.id === id) || null
}
