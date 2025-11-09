'use client'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function Comments({ postId, currentUser, commentsCount, onCommentsUpdate }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (response.ok) {
        setComments(result.comments || [])
      } else {
        setError('댓글을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('Comments load error:', error)
      setError('댓글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!newComment.trim()) {
      setError('댓글 내용을 입력해주세요.')
      return
    }

    if (newComment.length > 1000) {
      setError('댓글이 너무 깁니다. (최대 1000자)')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
        credentials: 'include',
      })

      const result = await response.json()

      if (response.ok) {
        setComments([...comments, result.comment])
        setNewComment('')
        
        // 부모 컴포넌트에 댓글 수 업데이트 알림
        if (onCommentsUpdate) {
          onCommentsUpdate(comments.length + 1)
        }
      } else {
        setError(result.error || '댓글 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Comment submit error:', error)
      setError('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) {
      setError('댓글 내용을 입력해주세요.')
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
          comment.id === commentId ? result.comment : comment
        ))
        setEditingId(null)
        setEditContent('')
        setError('')
      } else {
        setError(result.error || '댓글 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Comment edit error:', error)
      setError('댓글 수정에 실패했습니다.')
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId))
        
        // 부모 컴포넌트에 댓글 수 업데이트 알림
        if (onCommentsUpdate) {
          onCommentsUpdate(comments.length - 1)
        }
      } else {
        const result = await response.json()
        setError(result.error || '댓글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Comment delete error:', error)
      setError('댓글 삭제에 실패했습니다.')
    }
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko
      })
    } catch (error) {
      return '방금 전'
    }
  }

  return (
    <div className="space-y-4">
      {/* 댓글 작성 폼 */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {newComment.length}/1000
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting || !newComment.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            댓글을 불러오는 중...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
              {/* 프로필 이미지 */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* 댓글 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">
                    {comment.name || '익명 사용자'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                  {comment.updated_at && comment.updated_at !== comment.created_at && (
                    <span className="text-xs text-gray-400">(수정됨)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  /* 수정 모드 */
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      maxLength={1000}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditContent('')
                          setError('')
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 일반 모드 */
                  <>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                    
                    {/* 댓글 액션 버튼 (본인 댓글만) */}
                    {currentUser && currentUser.id === comment.user_id && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-xs text-gray-500 hover:text-blue-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs text-gray-500 hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}