'use client'

import { useState } from 'react'

const GENRES = ['발라드', '힙합', 'POP', '트로트', '댄스']

function toInputDate(v) {
  if (!v) return ''
  try {
    const d = typeof v === 'string' ? new Date(v) : v
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return ''
  }
}

export default function EditForm({ initial }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    gender: initial?.gender || '',
    birthDate: toInputDate(initial?.birthDate),
    favoriteGenres: Array.isArray(initial?.favoriteGenres)
      ? initial.favoriteGenres
      : (initial?.favoriteGenres || '').split(',').map(s => s.trim()).filter(Boolean),
    favoriteInfluencer: initial?.favoriteInfluencer || ''
  })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const setField = (name, value) => setForm(prev => ({ ...prev, [name]: value }))

  const toggleGenre = (g) => {
    setForm(prev => {
      const set = new Set(prev.favoriteGenres)
      if (set.has(g)) {
        set.delete(g)
      } else {
        set.add(g)
      }
      return { ...prev, favoriteGenres: Array.from(set) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setSaving(true)
    try {
      const r = await fetch('/api/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          gender: form.gender,
          birthDate: form.birthDate || null,
          favoriteGenres: form.favoriteGenres,
          favoriteInfluencer: form.favoriteInfluencer
        })
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || '수정 실패')
      // 성공 시 내 정보 페이지로 이동
      window.location.href = '/me'
    } catch (err) {
      setMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>닉네임</label>
        <input value={form.name} onChange={e => setField('name', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>이메일</label>
        <input value={form.email} readOnly />
      </div>

      <div className="form-group">
        <label>성별</label>
        <select value={form.gender} onChange={e => setField('gender', e.target.value)}>
          <option value="">선택</option>
          <option value="남">남성</option>
          <option value="여">여성</option>
        </select>
      </div>

      <div className="form-group">
        <label>생년월일</label>
        <input type="date" value={form.birthDate} onChange={e => setField('birthDate', e.target.value)} />
      </div>

      <div className="form-group">
        <label>좋아하는 장르</label>
        <div className="checkbox-group">
          {GENRES.map(g => (
            <label key={g} className="checkbox-item">
              <input type="checkbox" checked={form.favoriteGenres.includes(g)} onChange={() => toggleGenre(g)} />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>좋아하는 인플루언서/연예인</label>
        <input value={form.favoriteInfluencer} onChange={e => setField('favoriteInfluencer', e.target.value)} />
      </div>

      {msg && <p style={{ marginTop: 6 }}>{msg}</p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="submit" className="btn" disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
        <a href="/me" className="btn btn--ghost">취소</a>
      </div>
    </form>
  )
}
