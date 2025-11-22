// app/page.js
// 목적: 소셜 미디어 피드 메인 페이지
'use client'
import { useState, useEffect } from 'react'
import Sidebar from "../components/Sidebar"
import TagCloud from "../components/TagCloud"
import PostForm from "../components/PostForm"
import PostCard from "../components/PostCard"

export default function Page() {
  const [posts, setPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCurrentUser()
    loadPosts()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/me/profile', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData.user)
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    }
  }

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts?limit=20', {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setPosts(result.posts || [])
      } else {
        setError('게시글을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('Posts load error:', error)
      setError('게시글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const handlePostUpdate = (postId, updates) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ))
  }

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center">
        <div className="max-w-2xl mx-auto p-6">
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MusicShare Community
            </h1>
            <p className="text-gray-600">
              음악을 사랑하는 사람들의 소통 공간
            </p>
          </div>

          {/* 게시글 작성 폼 (로그인한 사용자만) */}
          {currentUser && (
            <PostForm onPostCreated={handlePostCreated} />
          )}

          {/* 로그인하지 않은 경우 안내 */}
          {!currentUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                커뮤니티에 참여하세요!
              </h3>
              <p className="text-blue-700 mb-4">
                로그인하여 게시글을 작성하고 다른 사용자들과 소통해보세요.
              </p>
              <a
                href="/auth"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                로그인 / 회원가입
              </a>
            </div>
          )}

          {/* 게시글 목록 */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">게시글을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={loadPosts}
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
                  아직 게시글이 없습니다
                </h3>
                <p className="text-gray-500">
                  첫 번째 게시글을 작성해보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 더 보기 버튼 (나중에 무한 스크롤로 대체 가능) */}
          {posts.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  // TODO: 페이지네이션 구현
                  alert('더 많은 게시글 불러오기 기능은 곧 추가될 예정입니다!')
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                더 많은 게시글 보기
              </button>
            </div>
          )}
        </div>
      </section>      
    </main>
  )
}
