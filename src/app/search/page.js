'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import VideoCard from '../../components/VideoCard'
import { getTracks } from '../../lib/data'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      searchTracks(query)
    }
  }, [query])

  const searchTracks = async (searchQuery) => {
    setLoading(true)
    try {
      // 실제로는 API 호출이지만, 현재는 더미 데이터에서 검색
      const allTracks = await getTracks()
      const filtered = allTracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    } catch (error) {
      console.error('검색 중 오류:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>검색 결과</h1>
        {query && (
          <p className="search-query">
            '<strong>{query}</strong>' 검색 결과 {results.length}개
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>검색 중...</p>
        </div>
      ) : (
        <>
          {results.length > 0 ? (
            <div className="grid-cards">
              {results.map(track => (
                <VideoCard key={track.id} item={track} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              {query ? (
                <>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어를 시도해보세요.</p>
                </>
              ) : (
                <>
                  <h3>검색어를 입력하세요</h3>
                  <p>아티스트나 노래 제목을 검색해보세요.</p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}