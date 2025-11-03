export const runtime = 'nodejs'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import EditForm from './EditForm'

export default async function EditProfilePage() {
  const session = await getSession()
  if (!session) redirect('/auth')

  const [rows] = await db.query(
    `SELECT id, name, email, gender, birth_date AS birthDate,
            favorite_genres AS favoriteGenres, favorite_influencer AS favoriteInfluencer
       FROM users WHERE id = ?`,
    [session.id]
  )
  const user = rows?.[0]
  if (!user) redirect('/auth')

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="card__title">정보 수정</div>
      <EditForm initial={user} />
    </div>
  )
}
