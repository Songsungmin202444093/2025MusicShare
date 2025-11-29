// lib/tracks.js
// 목적: 페이지/API에서 재사용할 쿼리 함수 집합(서비스 계층)
import pool from './db'

// 목록 조회: 태그까지 한 번에 묶어서 반환
export async function getTracks() {
    // MySQL 8의 JSON 집계: 태그가 없으면 빈 배열 반환
    const [rows] = await pool.query(`
        SELECT 
            t.id, t.title, t.artist, t.views, t.likes, t.youtubeId, t.thumb,
            COALESCE(JSON_ARRAYAGG(tt.tag), JSON_ARRAY()) AS tags
        FROM tracks t
        LEFT JOIN track_tags tt
            ON tt.track_id = t.id AND tt.tag IS NOT NULL
        GROUP BY t.id
        ORDER BY t.id DESC
    `)
    return rows
}

// 단일 트랙 조회
export async function getTrack(id) {
    const [rows] = await pool.query(`
        SELECT
            t.id, t.title, t.artist, t.views, t.likes, t.youtubeId, t.thumb, t.created_at,
            COALESCE(JSON_ARRAYAGG(tt.tag), JSON_ARRAY()) AS tags
        FROM tracks t
        LEFT JOIN track_tags tt
            ON tt.track_id = t.id AND tt.tag IS NOT NULL
        WHERE t.id = ?
        GROUP BY t.id
        LIMIT 1
    `, [id])
    return rows[0] || null
}

// 검색용 (키워드로 title, artist 검색)
export async function searchTracks(q) {
    const like = `%${q}%`
    const [rows] = await pool.query(`
        SELECT
            t.id, t.title, t.artist, t.views, t.likes, t.youtubeId, t.thumb,
            COALESCE(JSON_ARRAYAGG(tt.tag), JSON_ARRAY()) AS tags
        FROM tracks t
        LEFT JOIN track_tags tt
            ON tt.track_id = t.id AND tt.tag IS NOT NULL
        WHERE t.title LIKE ? OR t.artist LIKE ?
        GROUP BY t.id
        ORDER BY t.id DESC
    `, [like, like])
    return rows
}

// 셀럽 검색 (셀럽 이름으로 카드 정보 반환)
export async function searchCelebs(q) {
  const like = `%${q}%`
  const [rows] = await pool.query(`
    SELECT
      MIN(cr.id) AS id,
      cr.celeb_name AS name,
      COUNT(*) AS count,
      COALESCE((
        SELECT COUNT(*)
        FROM celeb_like_users clu
        JOIN celeb c ON clu.celeb_id = c.id
        WHERE c.name = cr.celeb_name
      ), 0) AS likes
    FROM celeb_recommendations cr
    WHERE cr.celeb_name LIKE ?
    GROUP BY cr.celeb_name
    ORDER BY cr.celeb_name
  `, [like])

  return rows
}

