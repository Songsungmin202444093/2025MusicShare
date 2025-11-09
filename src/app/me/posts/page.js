'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import TagCloud from '../../../components/TagCloud'

export default function MyPostsPage() {
  const [posts, setPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    loadCurrentUser()
    loadMyPosts()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/me/profile', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData.user)
      } else {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        router.push('/auth')
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      router.push('/auth')
    }
  }

  const loadMyPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/me/posts?limit=50', {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setPosts(result.posts || [])
      } else {
        if (response.status === 401) {
          router.push('/auth')
        } else {
          setError('게시글을 불러오는데 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('My posts load error:', error)
      setError('게시글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    setDeletingId(postId)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        const result = await response.json()
        alert(result.error || '게시글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '날짜 정보 없음'
    }
  }

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center">
        <div className="max-w-4xl mx-auto p-6">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="홈으로 돌아가기"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">내 게시물</h1>
            </div>
            {currentUser && (
              <p className="text-gray-600">
                {currentUser.name || currentUser.email || '사용자'}님이 작성한 게시물들입니다.
              </p>
            )}
          </div>

          {/* 게시물 목록 */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">게시물을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={loadMyPosts}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 작성한 게시물이 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  첫 번째 게시물을 작성해보세요!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  게시물 작성하러 가기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* 게시물 내용 */}
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed">
                            {truncateContent(post.content)}
                          </p>
                        </div>

                        {/* 게시물 정보 */}
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>{post.likes_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.comments_count}</span>
                          </div>
                          <span>{formatDate(post.created_at)}</span>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => router.push(`/posts/${post.id}`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            게시물 보기
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                              deletingId === post.id
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                          >
                            {deletingId === post.id ? '삭제 중...' : '삭제'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 통계 정보 */}
          {posts.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">게시물 통계</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                  <div className="text-sm text-gray-500">총 게시물</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {posts.reduce((sum, post) => sum + post.likes_count, 0)}
                  </div>
                  <div className="text-sm text-gray-500">총 좋아요</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {posts.reduce((sum, post) => sum + post.comments_count, 0)}
                  </div>
                  <div className="text-sm text-gray-500">총 댓글</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <aside className="right"><TagCloud /></aside>
    </main>
  )
}