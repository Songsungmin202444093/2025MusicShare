import Image from "next/image"
import Link from "next/link"

export default function CelebCard({ c }) {
  return (
    <Link href={`/celeb/${c.id}`} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
      <div className="relative w-full" style={{aspectRatio:"4/3"}}>
        <Image src={c.thumb} alt={c.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="text-2xl font-extrabold">{c.name}</div>
        <div className="flex items-center justify-between mt-4 text-gray-600">
          <span className="flex items-center gap-2 text-[#e53e3e]">💗 {Number(c.likes).toLocaleString()}</span>
          <span>{c.count}곡</span>
        </div>
      </div>
    </Link>
  )
}
