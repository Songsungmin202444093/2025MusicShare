"use client"
// 좌측 메뉴. 나중에 실제 라우팅(/popular 등)으로 연결 가능.
const menus = ["AI 추천","최신음악","많이봄","인기차트","TOP 100","K-POP","POP","발라드"]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul style={{display:'flex',flexDirection:'column',gap:'10px',padding:'12px 0'}}>
        {menus.map((m, i) => (
          <li key={m} style={{listStyle:'none'}}>
            <a
              href="#"
              style={{
                display:'flex',
                alignItems:'center',
                gap:'10px',
                padding:'12px 18px',
                borderRadius:'12px',
                fontWeight:'600',
                fontSize:'15px',
                color:'#222',
                background:i===0?"#e53e3e22":"#fff",
                border:i===0?"2px solid #e53e3e":"1px solid #e5e7eb",
                boxShadow:i===0?"0 2px 8px #e53e3e22":"0 1px 4px #e5e7eb44",
                transition:'all .2s',
                cursor:'pointer',
                position:'relative',
                letterSpacing:'-0.5px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#e53e3e';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '2px solid #e53e3e';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = i===0?"#e53e3e22":"#fff";
                e.currentTarget.style.color = '#222';
                e.currentTarget.style.border = i===0?"2px solid #e53e3e":"1px solid #e5e7eb";
              }}
            >
              {i===0 && <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#e53e3e',display:'inline-block'}}></span>}
              {m}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
