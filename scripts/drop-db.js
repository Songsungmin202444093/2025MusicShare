// 사용법: node scripts/drop-db.js
// .env.local 에서 DB 접속 정보를 읽어와 대상 DB를 완전히 삭제(DROP)합니다.

const fs = require('fs')
const path = require('path')

function readEnv(filePath) {
  const env = {}
  if (!fs.existsSync(filePath)) return env
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eq = trimmed.indexOf('=')
    if (eq === -1) return
    const key = trimmed.slice(0, eq)
    const val = trimmed.slice(eq + 1)
    env[key] = val
  })
  return env
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env.local')
  const env = readEnv(envPath)

  const host = env.DB_HOST || 'localhost'
  const port = Number(env.DB_PORT || 3306)
  const user = env.DB_USER || 'root'
  const password = env.DB_PASS || ''
  const dbName = env.DB_NAME || 'musicshare'

  console.log('[drop-db] 대상 DB:', dbName)
  console.log('[drop-db] 접속 정보:', { host, port, user, password: password ? '*****' : '(empty)' })

  let mysql
  try {
    mysql = require('mysql2/promise')
  } catch (err) {
    console.error('[drop-db] mysql2 패키지를 찾을 수 없습니다. 먼저 프로젝트에서 `npm install`을 실행하세요.')
    process.exit(1)
  }

  try {
    const conn = await mysql.createConnection({ host, port, user, password })
    await conn.query(`DROP DATABASE IF EXISTS \`${dbName}\``)
    console.log(`[drop-db] 데이터베이스 삭제 완료: ${dbName}`)
    await conn.end()
  } catch (err) {
    console.error('[drop-db] 실패:', err.message || err)
    process.exit(1)
  }
}

main()
