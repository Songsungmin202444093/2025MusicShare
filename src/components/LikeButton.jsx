'use client'
import { useEffect, useState } from 'react'

export default function LikeButton({ celebId }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const id = String(celebId ?? '')
  const clamp = (n) => (n < 0 ? 0 : n)

  // 전역 동기화 이벤트 수신 (목록/상세 동기화)
  useEffect(() => {
    const onSync = (e) => {
      const d = e.detail
      if (!d || String(d.id) !== id) return
      setLiked(!!d.liked)
      setCount(clamp(Number(d.count ?? 0)))
    }
    window.addEventListener('celeb-like-changed', onSync)
    return () => window.removeEventListener('celeb-like-changed', onSync)
  }, [id])

  // 초기 상태 조회
  useEffect(() => {
    if (!id) return
    fetch(`/api/celeb-likes/${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(d => {
        setLiked(!!d.liked)
        setCount(clamp(Number(d.count ?? 0)))
      })
      .catch(() => {})
  }, [id])

  // 토글: 네비게이션 차단 + 전역 브로드캐스트
  const toggle = async (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    const r = await fetch(`/api/celeb-likes/${encodeURIComponent(id)}`, { method: 'POST' })
    if (r.status === 401) { alert('로그인 후 이용해주세요.'); location.href = '/auth'; return }
    if (!r.ok) return
    const d = await r.json()
    const nextLiked = !!d.liked
    const nextCount = clamp(Number(d.count ?? 0))

    setLiked(nextLiked)
    setCount(nextCount)

    window.dispatchEvent(new CustomEvent('celeb-like-changed', {
      detail: { id, liked: nextLiked, count: nextCount }
    }))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      style={{
        background: liked ? '#e53e3e' : '#fff',
        color: liked ? '#fff' : '#e53e3e',
        border: '1px solid #e53e3e',
        borderRadius: 12,
        padding: '6px 10px',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        transition: 'all .15s ease'
      }}
    >
      💗 {count}
    </button>
  )
}
