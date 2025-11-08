// src/lib/db.js
// 목적: 핫리로드 시에도 커넥션 풀 1개만 유지 + 간편 쿼리 헬퍼 제공
import mysql from 'mysql2/promise'

// dev 모드에서 핫리로드 시 중복 생성을 막기 위한 전역 보관소
const globalForMysql = globalThis.__mysql__ ?? (globalThis.__mysql__ = {})

const pool =
  globalForMysql.pool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  })

// 최초 1회만 전역에 고정
if (!globalForMysql.pool) globalForMysql.pool = pool

// 간편 쿼리 헬퍼: rows만 반환
export async function q(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}

export default pool
export const db = pool
