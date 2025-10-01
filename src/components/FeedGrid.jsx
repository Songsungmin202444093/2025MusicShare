// 가운데 카드 목록. items 배열을 받아서 카드로 렌더링.
import VideoCard from "./VideoCard"

export default function FeedGrid({ items = [] }) {
  return (
    <div className="grid-cards">
      {items.map(x => <VideoCard key={x.id} item={x} />)}
    </div>
  )
}
