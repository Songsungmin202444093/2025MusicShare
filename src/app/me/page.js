export const runtime = 'nodejs'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

function formatDate(v) {
  if (!v) return ''
  try {
    const d = typeof v === 'string' ? new Date(v) : v
    // YYYY-MM-DD
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return String(v)
  }
}

export default async function MePage() {
  const session = await getSession()
  if (!session) redirect('/auth')

  // DB에서 최신 프로필 조회 (회원가입 시 저장한 값 포함)
  const [rows] = await db.query(
    `SELECT id, name, email, gender, birth_date AS birthDate,
            favorite_genres AS favoriteGenres, favorite_influencer AS favoriteInfluencer
       FROM users WHERE id = ?`,
    [session.id]
  )
  const user = rows?.[0]
  if (!user) redirect('/auth')

  const genresArr = (user.favoriteGenres || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="card__title">내 정보</div>

      <div className="form-group"><label>이름</label><div>{user.name}</div></div>
      <div className="form-group"><label>이메일</label><div>{user.email}</div></div>
      <div className="form-group"><label>성별</label><div>{user.gender || '-'}</div></div>
      <div className="form-group"><label>생년월일</label><div>{formatDate(user.birthDate) || '-'}</div></div>
      <div className="form-group"><label>좋아하는 장르</label>
        <div>
          {genresArr.length ? (
            <div className="tags">
              {genresArr.map(g => <span key={g} className="tag">{g}</span>)}
            </div>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
      <div className="form-group"><label>좋아하는 인플루언서/연예인</label><div>{user.favoriteInfluencer || '-'}</div></div>

      <div style={{ marginTop: 16 }}>
        <a href="/me/edit" className="btn">정보 수정</a>
      </div>
    </div>
  )
}
