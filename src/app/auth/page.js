'use client' // ✅ 클라이언트 컴포넌트로 지정 (useState 등 훅 사용 가능)

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// ✅ 회원가입 장르 옵션(체크박스용)
const GENRES = ['발라드', '힙합', 'POP', '트로트', '댄스']

export default function AuthPage() {
  // ✅ 로그인/회원가입 모드 구분 (true=로그인, false=회원가입)
  const [isLogin, setIsLogin] = useState(true)

  // ✅ 폼 입력값 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    favoriteGenres: [],
    favoriteInfluencer: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // ✅ 처리 결과 메시지 저장
  const [msg, setMsg] = useState('')
  const searchParams = useSearchParams()

  // 소셜 로그인 리다이렉트 결과 표시
  useEffect(() => {
    const social = searchParams.get('social')
    const error = searchParams.get('error')
    if (social === 'kakao') {
      if (error === 'email_required') {
        setMsg('카카오에서 이메일 제공 동의가 필요합니다. 동의 후 다시 시도해주세요.')
      } else if (error) {
        setMsg('카카오 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }, [searchParams])

  // ✅ 입력 변화 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  // ✅ 장르 체크박스 토글
  const toggleGenre = (g) => {
    setFormData((p) => {
      const set = new Set(p.favoriteGenres)
      if (set.has(g)) set.delete(g)
      else set.add(g)
      return { ...p, favoriteGenres: Array.from(set) }
    })
  }

  // ✅ 로그인 또는 회원가입 버튼 클릭 시 동작
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('') // 기존 메시지 초기화

    // 🔒 회원가입 시 비밀번호 확인 검증
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMsg('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      if (isLogin) {
        // ✅ 로그인 요청
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || '로그인 실패')
  setMsg('로그인 성공')
  // 로그인 후 홈으로 이동하여 헤더가 갱신되도록 처리
  window.location.href = '/'
      } else {
        // ✅ 회원가입 요청
        const r = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            gender: formData.gender,
            birthDate: formData.birthDate,
            // 서버는 문자열 컬럼을 사용하므로 콤마로 직렬화해 전송
            favoriteGenres: (formData.favoriteGenres || []).join(','),
            favoriteInfluencer: formData.favoriteInfluencer,
            email: formData.email,
            password: formData.password
          })
        })
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || '회원가입 실패')
  // 서버가 세션 쿠키를 이미 설정하므로 홈으로 이동하여 헤더 갱신
  window.location.href = '/'
      }
    } catch (err) {
      setMsg(err.message) // 에러 메시지 표시
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* ✅ 제목 영역 */}
        <div className="auth-header">
          <h1>{isLogin ? '로그인' : '회원가입'}</h1>
          <p>{isLogin ? 'MusicShare에 오신 것을 환영합니다' : '새 계정을 만들어보세요'}</p>
        </div>

        {/* ✅ 입력 폼 */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* 회원가입일 때만 추가 필드 표시 */}
          {!isLogin && (
            <>
              {/* 이름 */}
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              {/* 성별 */}
              <div className="form-group">
                <label htmlFor="gender">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">선택</option>
                  <option value="남">남성</option>
                  <option value="여">여성</option>
                </select>
              </div>

              {/* 생년월일 */}
              <div className="form-group">
                <label htmlFor="birthDate">생년월일</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              {/* 좋아하는 장르(체크박스 - 컴팩트) */}
              <div className="form-group">
                <label>좋아하는 장르</label>
                <div className="checkbox-group">
                  {GENRES.map((g) => (
                    <label key={g} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.favoriteGenres.includes(g)}
                        onChange={() => toggleGenre(g)}
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 좋아하는 인플루언서 */}
              <div className="form-group">
                <label htmlFor="favoriteInfluencer">좋아하는 인플루언서/연예인</label>
                <input
                  id="favoriteInfluencer"
                  name="favoriteInfluencer"
                  value={formData.favoriteInfluencer}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </>
          )}

          {/* 이메일 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {/* 회원가입 시 비밀번호 확인 */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>
          )}

          {/* 제출 버튼 */}
          <button type="submit" className="auth-submit">
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* ✅ 하단 링크(회원가입 ↔ 로그인 전환) */}
        <div className="auth-footer">
          <p>
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
          {/* 서버 응답 메시지 표시 */}
          {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
        </div>

        {/* ✅ 소셜 로그인 버튼 */}
        <div className="auth-divider"><span>또는</span></div>
        <div className="social-auth">
          {/* 카카오 로그인 버튼 */}
          <button
            className="social-btn kakao"
            type="button"
            onClick={() => {
              window.location.href = '/api/auth/kakao'
            }}
          >
            <span>카카오로 계속하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
