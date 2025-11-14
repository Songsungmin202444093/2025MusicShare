// src/app/celeb/favorites/page.js
export const runtime = 'nodejs'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Sidebar from '../../../components/Sidebar'
import TagCloud from '../../../components/TagCloud'
import Image from 'next/image'

async function getFavorites(userId) {
  const [rows] = await db.query(
    `
    SELECT 
        c.id   AS celeb_id,
        c.name AS celeb_name,
        COUNT(DISTINCT r.id) AS track_count
    FROM celeb_like_users l
    JOIN celeb c
      ON c.id = l.celeb_id
    LEFT JOIN celeb_recommendations r
      ON r.celeb_name = c.name
    WHERE l.user_id = ?
    GROUP BY c.id, c.name
    ORDER BY c.name;
    `,
    [userId]
  )
  return rows
}

export default async function FavoriteCelebPage() {
  const session = await getSession()
  if (!session) redirect('/auth')

  const items = await getFavorites(session.id)

  return (
    <main className="grid">
      <aside className="left"><Sidebar /></aside>

      <section className="center">
        <h1 className="text-3xl font-bold mb-6">좋아요한 유명인</h1>

        {items.length === 0 ? (
          <p>아직 하트를 누른 유명인이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(i => (
              <div key={i.celeb_id} className="bg-white rounded-2xl shadow-lg overflow-hidden">

                <div className="relative w-full" style={{ aspectRatio:'1/1', minHeight:'260px' }}>
                  <Image
                    src={`/celeb/${encodeURIComponent(i.celeb_name)}.png`}
                    alt={i.celeb_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-3">{i.celeb_name}</h2>
                  <div className="text-gray-500 text-sm">{i.track_count}곡</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="right"><TagCloud /></aside>
    </main>
  )
}
