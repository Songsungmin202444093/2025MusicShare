'use client'
import { useEffect, useState } from 'react'

export default function CelebLike({ celebId, initial=0 }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initial)

  useEffect(() => {
    fetch(`/api/celeb-likes/${celebId}`).then(r=>r.json()).then(d=>{
      setLiked(!!d.liked); setCount(typeof d.count==='number'? d.count : initial)
    })
  }, [celebId])

  const toggle = async () => {
    const r = await fetch(`/api/celeb-likes/${celebId}`, { method: 'POST' })
    if (r.status === 401) { alert('로그인 후 이용해주세요.'); location.href='/auth'; return }
    const d = await r.json()
    setLiked(d.liked); setCount(d.count)
  }

  return (
    <button onClick={toggle}
      style={{background: liked?'#e53e3e':'#fff',color: liked?'#fff':'#e53e3e',
              border:'1px solid #e53e3e',borderRadius:12,padding:'6px 10px',
              fontWeight:700,display:'inline-flex',alignItems:'center',gap:6}}>
      💗 {count}
    </button>
  )
}
