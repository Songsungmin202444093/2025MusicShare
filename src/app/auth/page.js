'use client'

import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    birthdate: '',
    genre: '',
    celebrity: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      // 로그인 API 호출
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const data = await res.json()
      if (data.success) {
        alert('로그인 성공!')
      } else {
        alert(data.error || '로그인 실패')
      }
    } else {
      // 회원가입 API 호출
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert('회원가입 성공!')
        setIsLogin(true)
      } else {
        alert(data.error || '회원가입 실패')
      }
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? '로그인' : '회원가입'}</h1>
          <p>{isLogin ? 'MusicShare에 오신 것을 환영합니다' : '새 계정을 만들어보세요'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required={!isLogin}
                >
                  <option value="">선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="birthdate">생년월일</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label htmlFor="genre">좋아하는 장르</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="예: 발라드, 힙합, 락"
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label htmlFor="celebrity">좋아하는 인플루언서/연예인</label>
                <input
                  type="text"
                  id="celebrity"
                  name="celebrity"
                  value={formData.celebrity}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required={!isLogin}
                />
              </div>
            </>
          )}
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
                required={!isLogin}
              />
            </div>
          )}
          <button type="submit" className="auth-submit">
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button 
              className="auth-toggle"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>

        <div className="auth-divider">
          <span>또는</span>
        </div>

        <div className="social-auth">
          <button
            className="social-btn kakao"
            type="button"
            onClick={() => {
              window.location.href =
                'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code';
            }}
          >
            <span>카카오로 계속하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}