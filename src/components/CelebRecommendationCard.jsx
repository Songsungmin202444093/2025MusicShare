'use client'
// 셀럽 포토카드 컴포넌트
import Link from 'next/link'
import Image from 'next/image'

function thumbPath(name) {
  return `/celeb/${encodeURIComponent(name)}.png`
}

export default function CelebRecommendationCard({ celeb }) {
  return (
    <Link
      href={`/celeb/${encodeURIComponent(celeb.name)}`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
    >
      <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
        <Image 
          src={thumbPath(celeb.name)} 
          alt={celeb.name} 
          fill 
          className="object-cover" 
        />
      </div>

      <div className="p-5">
        <div className="text-2xl font-extrabold">{celeb.name}</div>

        <div className="flex items-center justify-between mt-4 text-gray-600">
          <span className="flex items-center gap-1">
            ❤️ {celeb.likes}
          </span>
          <span>{celeb.count}곡</span>
        </div>
      </div>
    </Link>
  )
}
