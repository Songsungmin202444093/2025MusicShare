// src/lib/db.js
// 목적: 매 요청마다 새 연결을 열지 않고 커넥션 풀을 재사용하여 성능 향상
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST,                    // .env.local의 DB_HOST 값
    port: Number(process.env.DB_PORT || 3306),    // DB 포트 (기본 3306)
    user: process.env.DB_USER,                    // DB 사용자
    password: process.env.DB_PASS,                // DB 비밀번호
    database: process.env.DB_NAME,                // 사용할 DB 이름
    waitForConnections: true,                     // 풀에 여유 없으면 대기
    connectionLimit: 10,                          // 동시 연결 개수 제한
    maxIdle: 10,                                  // 유휴 연결 유지 개수
    idleTimeout: 60000,                           // 유휴 연결 정리 시간
    enableKeepAlive: true,                        // KeepAlive 활성화
    keepAliveInitialDelay: 0                      // 즉시 KeepAlive 시작
})

export default pool
