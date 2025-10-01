// 우측 태그 카드. 인기/추천 해시태그를 보여줌.
const tags = ["#NewJeans","#IVE","#세븐틴","#핫","#트렌드","#조회수많음","#댄스","#발라드"]

export default function TagCloud() {
  return (
    <div className="card">
      <div className="card__title">#트렌딩 해시태그</div>
      <div className="tags">
        {tags.map(t => (
          <a key={t} href="#" className="tag">{t}</a>
        ))}
      </div>
    </div>
  )
}
