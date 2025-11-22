'use client'
// 목적: 클라이언트 컴포넌트에서 /api/tracks?q=, /api/posts?q=, /api/celeb-recommendations?q= 로 검색
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import VideoCard from '../../components/VideoCard'
import PostCard from '../../components/PostCard'
import CelebRecommendationCard from '../../components/CelebRecommendationCard'

export default function SearchPage() {
  const q = useSearchParams().get('q') || ''
  const [tracks, setTracks] = useState([])
  const [posts, setPosts] = useState([])
  const [celebRecs, setCelebRecs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!q) { 
        setTracks([])
        setPosts([])
        setCelebRecs([])
        return 
      }
      setLoading(true)
      try {
        const [tracksRes, postsRes, celebRecsRes] = await Promise.all([
          fetch(`/api/tracks?q=${encodeURIComponent(q)}`, { cache: 'no-store' }),
          fetch(`/api/posts?q=${encodeURIComponent(q)}&limit=50`, { cache: 'no-store' }),
          fetch(`/api/celeb-recommendations?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        ])
        
        setTracks(tracksRes.ok ? await tracksRes.json() : [])
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] }
        setPosts(postsData.posts || [])
        setCelebRecs(celebRecsRes.ok ? await celebRecsRes.json() : [])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [q])

  const totalResults = tracks.length + posts.length + celebRecs.length

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>검색 결과</h1>
        {q && <p className="search-query">'<strong>{q}</strong>' 검색 결과 {totalResults}개</p>}
      </div>

      {loading ? (
        <div className="loading"><div className="loading-spinner"></div><p>검색 중...</p></div>
      ) : (
        <>
          {celebRecs.length > 0 && (
            <div className="search-section">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>🌟 유명인 ({celebRecs.length})</h2>
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: '2rem' }}>
                {celebRecs.map(celeb => <CelebRecommendationCard key={celeb.id} celeb={celeb} />)}
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div className="search-section">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>게시글 ({posts.length})</h2>
              <div style={{ marginBottom: '2rem' }}>
                {posts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            </div>
          )}
          
          {tracks.length > 0 && (
            <div className="search-section">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>트랙 ({tracks.length})</h2>
              <div className="grid-cards">{tracks.map(v => <VideoCard key={v.id} item={v} />)}</div>
            </div>
          )}

          {!loading && totalResults === 0 && (
            <div className="no-results">
              {q ? (
                <>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색어를 시도해보세요.</p>
                </>
              ) : (
                <>
                  <h3>검색어를 입력하세요</h3>
                  <p>아티스트, 노래 제목, 셀럽 이름, 게시글 내용을 검색해보세요.</p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
