'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import TagCloud from '../../../components/TagCloud'

export default function MyCommentsPage() {
  const [comments, setComments] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadCurrentUser()
    loadMyComments()
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
        router.push('/auth')
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      router.push('/auth')
    }
  }

  const loadMyComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/me/comments?limit=50', {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setComments(result.comments || [])
      } else {
        if (response.status === 401) {
          router.push('/auth')
        } else {
          setError('댓글을 불러오는데 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('My comments load error:', error)
      setError('댓글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent.trim() }),
        credentials: 'include',
      })

      const result = await response.json()

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: editContent.trim(), updated_at: new Date().toISOString() }
            : comment
        ))
        setEditingId(null)
        setEditContent('')
      } else {
        alert(result.error || '댓글 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Edit error:', error)
      alert('댓글 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    setDeletingId(commentId)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId))
      } else {
        const result = await response.json()
        alert(result.error || '댓글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('댓글 삭제에 실패했습니다.')
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
              <h1 className="text-3xl font-bold text-gray-900">내 댓글</h1>
            </div>
            {currentUser && (
              <p className="text-gray-600">
                {currentUser.name || currentUser.email || '사용자'}님이 작성한 댓글들입니다.
              </p>
            )}
          </div>

          {/* 댓글 목록 */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">댓글을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={loadMyComments}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 작성한 댓글이 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  게시물에 첫 번째 댓글을 작성해보세요!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  게시물 보러 가기
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* 댓글이 달린 게시물 정보 */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">댓글을 단 게시물</span>
                            <span className="text-xs text-gray-500">by {comment.post_author_name}</span>
                          </div>
                          <p className="text-gray-800 text-sm mb-2">
                            {truncateContent(comment.post_content, 150)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>❤️ {comment.likes_count}</span>
                            <span>💬 {comment.comments_count}</span>
                          </div>
                        </div>

                        {/* 내 댓글 내용 */}
                        <div className="mb-4">
                          {editingId === comment.id ? (
                            /* 수정 모드 */
                            <div className="space-y-3">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                maxLength={1000}
                              />
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleEditSubmit(comment.id)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null)
                                    setEditContent('')
                                  }}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* 일반 모드 */
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                              <p className="text-gray-800 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 댓글 정보 */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>작성: {formatDate(comment.created_at)}</span>
                          {comment.updated_at && comment.updated_at !== comment.created_at && (
                            <span>수정: {formatDate(comment.updated_at)}</span>
                          )}
                        </div>

                        {/* 액션 버튼들 */}
                        {editingId !== comment.id && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => router.push(`/posts/${comment.post_id}`)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              게시물 보기
                            </button>
                            <button
                              onClick={() => handleEdit(comment)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              disabled={deletingId === comment.id}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                deletingId === comment.id
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {deletingId === comment.id ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 통계 정보 */}
          {comments.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">댓글 통계</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{comments.length}</div>
                  <div className="text-sm text-gray-500">총 댓글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(comments.map(c => c.post_id)).size}
                  </div>
                  <div className="text-sm text-gray-500">댓글 단 게시물</div>
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