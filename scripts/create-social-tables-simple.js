// scripts/create-social-tables-simple.js
// 소셜 미디어 테이블 생성 스크립트 (간단 버전)
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function createSocialTables() {
  let connection
  
  try {
    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'musicshare'
    })

    console.log('데이터베이스에 연결되었습니다.')

    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, 'create-social-tables-simple.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // SQL을 세미콜론으로 분할하여 각각 실행
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    console.log(`${statements.length}개의 SQL 문을 실행합니다...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`${i + 1}. ${statement.split('\n')[1] || '실행 중...'}`)
      await connection.execute(statement)
      console.log(`${i + 1}. 완료`)
    }

    console.log('✅ 모든 소셜 미디어 테이블이 성공적으로 생성되었습니다!')

  } catch (error) {
    console.error('❌ 테이블 생성 중 오류가 발생했습니다:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('데이터베이스 연결이 종료되었습니다.')
    }
  }
}

// 환경변수 로드
require('dotenv').config({ path: '.env.local' })

// 스크립트 실행
createSocialTables()