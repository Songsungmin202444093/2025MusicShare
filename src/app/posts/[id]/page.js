'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import TagCloud from '../../../components/TagCloud'
import PostCard from '../../../components/PostCard'

export default function PostDetailPage({ params }) {
  const [post, setPost] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const resolvedParams = use(params)
  const postId = resolvedParams.id

  useEffect(() => {
    loadCurrentUser()
    loadPost()
  }, [postId])

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

  const loadPost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setPost(result.post)
      } else {
        if (response.status === 404) {
          setError('게시물을 찾을 수 없습니다.')
        } else {
          setError('게시물을 불러오는데 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('Post load error:', error)
      setError('게시물을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostUpdate = (postId, updates) => {
    setPost(prev => ({ ...prev, ...updates }))
  }

  const handlePostDelete = (postId) => {
    router.push('/') // 삭제 후 홈으로 이동
  }

  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>
      <section className="center">
        <div className="max-w-2xl mx-auto p-6">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="뒤로 가기"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">게시물</h1>
            </div>
          </div>

          {/* 게시물 내용 */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">게시물을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700 mb-4">{error}</p>
                  <div className="space-x-3">
                    <button
                      onClick={loadPost}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      다시 시도
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      홈으로 돌아가기
                    </button>
                  </div>
                </div>
              </div>
            ) : post ? (
              <PostCard
                post={post}
                currentUser={currentUser}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ) : null}
          </div>
        </div>
      </section>
      <aside className="right"><TagCloud /></aside>
    </main>
  )
}