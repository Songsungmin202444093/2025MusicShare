'use client'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import Comments from './Comments'

export default function PostCard({ post, currentUser, onUpdate, onDelete }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0)
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content || '')
  const [editYoutubeEmbed, setEditYoutubeEmbed] = useState(post.youtube_embed || '')
  const [showEditYoutube, setShowEditYoutube] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // post props가 변경될 때 상태 동기화
  useEffect(() => {
    setCommentsCount(post.comments_count || 0)
    setLikesCount(post.likes_count || 0)
  }, [post.comments_count, post.likes_count])

  // 좋아요 상태 초기화
  useEffect(() => {
    if (currentUser) {
      checkLikeStatus()
    }
  }, [post.id, currentUser])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        credentials: 'include'
      })
      const result = await response.json()
      if (response.ok) {
        setLiked(result.liked)
        setLikesCount(result.likesCount)
      }
    } catch (error) {
      console.error('Like status check error:', error)
    }
  }

  const handleLike = async () => {
    if (!currentUser || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setLiked(result.liked)
        setLikesCount(result.likesCount)
        
        // 부모 컴포넌트에 업데이트 알림
        if (onUpdate) {
          onUpdate(post.id, { likes_count: result.likesCount })
        }
      } else {
        console.error('Like error:', result.error)
      }
    } catch (error) {
      console.error('Like request error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const onCommentsUpdate = (newCount) => {
    setCommentsCount(newCount)
    if (onUpdate) {
      onUpdate(post.id, { comments_count: newCount })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(post.content || '')
    setEditYoutubeEmbed(post.youtube_embed || '')
    setShowEditYoutube(!!post.youtube_embed)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(post.content || '')
    setEditYoutubeEmbed(post.youtube_embed || '')
    setShowEditYoutube(false)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      alert('게시글 내용을 입력해주세요.')
      return
    }

    if (editContent.length > 2000) {
      alert('게시글이 너무 깁니다. (최대 2000자)')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: editContent.trim(),
          youtube_embed: editYoutubeEmbed.trim() || null
        }),
        credentials: 'include',
      })

      const result = await response.json()

      if (response.ok) {
        setIsEditing(false)
        setShowEditYoutube(false)
        // 부모 컴포넌트에 업데이트 알림
        if (onUpdate) {
          onUpdate(post.id, { 
            content: editContent.trim(),
            youtube_embed: editYoutubeEmbed.trim() || null
          })
        }
      } else {
        alert(result.error || '게시글 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('Edit error:', error)
      alert('게시글 수정에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUser || currentUser.id !== post.user_id || isDeleting) return

    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        // 부모 컴포넌트에 삭제 알림
        if (onDelete) {
          onDelete(post.id)
        }
      } else {
        const result = await response.json()
        alert(result.error || '게시글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* 사용자 정보 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {post.name ? post.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">
              {post.name || '익명 사용자'}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
        
        {/* 수정/삭제 버튼 (본인 게시글만) */}
        {currentUser && currentUser.id === post.user_id && (
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="게시글 수정"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-2 rounded-full transition-colors ${
                isDeleting 
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
              title="게시글 삭제"
            >
              {isDeleting ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 게시글 내용 */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
            placeholder="게시글 내용을 입력하세요..."
            maxLength={2000}
          />
          <div className="text-right text-sm text-gray-500 mt-1 mb-3">
            {editContent.length}/2000
          </div>

          {/* YouTube 소스 코드 수정 영역 */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowEditYoutube(!showEditYoutube)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showEditYoutube
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showEditYoutube ? '🎬 영상 제거' : '🎬 영상 추가/수정'}
            </button>
          </div>

          {showEditYoutube && (
            <div className="mb-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube 소스 코드
              </label>
              <textarea
                value={editYoutubeEmbed}
                onChange={(e) => setEditYoutubeEmbed(e.target.value)}
                placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/..." ...></iframe>'
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows={3}
              />
              <div className="mt-2 text-xs text-gray-500">
                💡 YouTube 영상 → 마우스 우클릭 → 소스 코드 복사 (비우면 영상만 삭제됩니다)
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSaving || !editContent.trim()}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" 
            onClick={() => router.push(`/posts/${post.id}`)}
            title="게시물 상세 보기"
          >
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
          
          {/* YouTube 영상 임베드 */}
          {post.youtube_embed && (
            <div className="mt-4 rounded-lg overflow-hidden relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div 
                className="absolute top-0 left-0 w-full h-full"
                dangerouslySetInnerHTML={{ 
                  __html: post.youtube_embed.replace(
                    /<iframe/g, 
                    '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%"'
                  )
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          disabled={!currentUser || isLiking}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            !currentUser 
              ? 'text-gray-400 cursor-not-allowed'
              : liked 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg 
            className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''}`} 
            fill={liked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span className="text-sm font-medium">{likesCount}</span>
        </button>

        {/* 댓글 버튼 */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>

        {/* 공유 버튼 */}
        <button
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`)
              .then(() => alert('링크가 복사되었습니다!'))
              .catch(() => alert('링크 복사에 실패했습니다.'))
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
            />
          </svg>
          <span className="text-sm font-medium">공유</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Comments 
            postId={post.id}
            currentUser={currentUser}
            commentsCount={commentsCount}
            onCommentsUpdate={onCommentsUpdate}
          />
        </div>
      )}
    </div>
  )
}