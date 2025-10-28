'use client'
// 목적: 클라이언트 컴포넌트에서 /api/tracks?q= 로 검색
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import VideoCard from '../../components/VideoCard'

export default function SearchPage() {
  const q = useSearchParams().get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!q) { setResults([]); return }
      setLoading(true)
      try {
        const r = await fetch(`/api/tracks?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        setResults(r.ok ? await r.json() : [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [q])

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>검색 결과</h1>
        {q && <p className="search-query">'<strong>{q}</strong>' 검색 결과 {results.length}개</p>}
      </div>

      {loading ? (
        <div className="loading"><div className="loading-spinner"></div><p>검색 중...</p></div>
      ) : results.length ? (
        <div className="grid-cards">{results.map(v => <VideoCard key={v.id} item={v} />)}</div>
      ) : (
        <div className="no-results">{q ? (<><h3>검색 결과가 없습니다</h3><p>다른 검색어를 시도해보세요.</p></>) : (<><h3>검색어를 입력하세요</h3><p>아티스트나 노래 제목을 검색해보세요.</p></>)}</div>
      )}
    </div>
  )
}
