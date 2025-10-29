// 사용법: node scripts/list-db.js
// .env.local에서 DB 접속 정보 읽어와 SHOW DATABASES 실행
const fs = require('fs')
const path = require('path')

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env.local')
  const env = {}
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eq = trimmed.indexOf('=')
      if (eq === -1) return
      const key = trimmed.slice(0, eq)
      const val = trimmed.slice(eq + 1)
      env[key] = val
    })
  }

  const host = env.DB_HOST || 'localhost'
  const port = Number(env.DB_PORT || 3306)
  const user = env.DB_USER || 'root'
  const password = env.DB_PASS || ''

  console.log('[list-db] 접속 정보:', { host, port, user, password: password ? '*****' : '(empty)' })

  let mysql
  try {
    mysql = require('mysql2/promise')
  } catch (err) {
    console.error('[list-db] mysql2 패키지를 찾을 수 없습니다. 먼저 프로젝트에서 `npm install`을 실행하세요.')
    process.exit(1)
  }

  try {
    const conn = await mysql.createConnection({ host, port, user, password })
    const [rows] = await conn.query('SHOW DATABASES')
    console.log('\n[list-db] 데이터베이스 목록:')
    rows.forEach(r => console.log(' -', r.Database || r.database || JSON.stringify(r)))
    await conn.end()
  } catch (err) {
    console.error('\n[list-db] MySQL 접속 실패:', err.message || err)
    process.exit(1)
  }
}

main()
