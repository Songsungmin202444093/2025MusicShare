'use client'
// 비밀번호 재설정 페이지
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setMsg('유효하지 않은 접근입니다.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')

    if (newPassword !== confirmPassword) {
      setMsg('비밀번호가 일치하지 않습니다.')
      return
    }

    if (newPassword.length < 6) {
      setMsg('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '비밀번호 변경 실패')
      }

      setMsg('✅ 비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다...')
      setTimeout(() => {
        router.push('/auth')
      }, 2000)

    } catch (error) {
      setMsg('❌ ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>오류</h1>
            <p>유효하지 않은 접근입니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>비밀번호 재설정</h1>
          <p>새로운 비밀번호를 입력해주세요</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 (최소 6자)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>

        {msg && (
          <div className="auth-footer">
            <p>{msg}</p>
          </div>
        )}
      </div>
    </div>
  )
}
