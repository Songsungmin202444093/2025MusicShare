// src/components/LikeButton.jsx
"use client"
import { useState, useTransition } from "react"

export default function LikeButton({ celebId, initialLikes = 0, onChange }) {
  const [likes, setLikes] = useState(initialLikes)
  const [pending, start] = useTransition()

  const click = () => {
    start(async () => {
      const res = await fetch(`/api/celeb/${celebId}/like`, { method: "POST" })
      if (!res.ok) return
      const data = await res.json()
      setLikes(data.likes ?? likes)
      onChange?.(data.likes ?? likes)
    })
  }

  return (
    <button
      onClick={click}
      disabled={pending}
      className="px-3 py-1 rounded-lg border hover:bg-gray-50"
      title="좋아요"
    >
      💗 {likes.toLocaleString()}
    </button>
  )
}
