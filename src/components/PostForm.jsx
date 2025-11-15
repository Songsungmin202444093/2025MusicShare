'use client'
import { useState } from 'react'

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [youtubeEmbed, setYoutubeEmbed] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    if (content.length > 2000) {
      setError('내용이 너무 깁니다. (최대 2000자)')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: content.trim(),
          youtube_embed: youtubeEmbed.trim() || null
        }),
        credentials: 'include', // 쿠키 포함
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '게시글 작성에 실패했습니다.')
      }

      // 성공시 폼 리셋
      setContent('')
      setYoutubeEmbed('')
      setShowYoutubeInput(false)
      
      // 부모 컴포넌트에 새 게시글 알림
      if (onPostCreated) {
        onPostCreated(result.post)
      }

    } catch (err) {
      console.error('Post creation error:', err)
      setError(err.message || '게시글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 일이 일어나고 있나요?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {content.length}/2000
          </div>
        </div>

        {/* YouTube 임베드 입력 영역 */}
        {showYoutubeInput && (
          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube 소스 코드
            </label>
            <textarea
              value={youtubeEmbed}
              onChange={(e) => setYoutubeEmbed(e.target.value)}
              placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/..." ...></iframe>'
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 YouTube 영상 → 마우스 우클릭 → 소스 코드 복사
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowYoutubeInput(!showYoutubeInput)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showYoutubeInput
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isSubmitting}
            >
              {showYoutubeInput ? '🎬 영상 제거' : '🎬 영상 추가'}
            </button>
            <div className="text-sm text-gray-500">
              공개 게시글로 작성됩니다
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSubmitting || !content.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? '게시 중...' : '게시'}
          </button>
        </div>
      </form>
    </div>
  )
}