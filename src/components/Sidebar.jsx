
"use client"

import { useState } from "react"

const menus = [
  { label: "유명인 추천 음악", href: "/celeb" },
  { label: "최신 음악" },
  { label: "인기 음악" },
  { label: "오늘의 음악" },
  { label: "장르 음악", genres: ["발라드", "힙합", "POP", "트로트", "댄스"] }
]

export default function Sidebar() {
  const [genreOpen, setGenreOpen] = useState(false)
  return (
    <nav className="sidebar">
      <ul style={{display:'flex',flexDirection:'column',gap:'10px',padding:'12px 0'}}>
        {menus.map((menu, i) => (
          <li key={menu.label} style={{listStyle:'none',position:'relative'}}>
            {menu.genres ? (
              <>
                <a
                  href="#"
                  style={{
                    display:'flex',alignItems:'center',gap:'10px',padding:'12px 18px',borderRadius:'12px',fontWeight:'600',fontSize:'15px',color:'#222',background:'#fff',border:'1px solid #e5e7eb',boxShadow:'0 1px 4px #e5e7eb44',transition:'all .2s',cursor:'pointer',position:'relative',letterSpacing:'-0.5px'
                  }}
                  onMouseOver={()=>setGenreOpen(true)}
                  onMouseOut={()=>setGenreOpen(false)}
                >
                  {menu.label}
                  <span style={{marginLeft:'auto',fontSize:'13px',color:'#e53e3e'}}>▼</span>
                </a>
                {genreOpen && (
                  <ul style={{position:'absolute',top:'48px',left:'0',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',boxShadow:'0 4px 16px #e5e7eb44',padding:'8px 0',minWidth:'160px',zIndex:10}} onMouseOver={()=>setGenreOpen(true)} onMouseOut={()=>setGenreOpen(false)}>
                    {menu.genres.map(genre => (
                      <li key={genre} style={{listStyle:'none'}}>
                        <a href="#" style={{display:'block',padding:'10px 18px',fontSize:'14px',color:'#222',borderRadius:'8px',transition:'all .2s',cursor:'pointer'}}
                          onMouseOver={e => {e.currentTarget.style.background='#e53e3e';e.currentTarget.style.color='#fff'}}
                          onMouseOut={e => {e.currentTarget.style.background='#fff';e.currentTarget.style.color='#222'}}
                        >{genre}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <a
                href={menu.href || "#"}
                style={{
                  display:'flex',alignItems:'center',gap:'10px',padding:'12px 18px',borderRadius:'12px',fontWeight:'600',fontSize:'15px',color:'#222',background:'#fff',border:'1px solid #e5e7eb',boxShadow:'0 1px 4px #e5e7eb44',transition:'all .2s',cursor:'pointer',position:'relative',letterSpacing:'-0.5px'
                }}
                onMouseOver={e => {e.currentTarget.style.background='#e53e3e';e.currentTarget.style.color='#fff';e.currentTarget.style.border='2px solid #e53e3e'}}
                onMouseOut={e => {e.currentTarget.style.background='#fff';e.currentTarget.style.color='#222';e.currentTarget.style.border='1px solid #e5e7eb'}}
              >
                {menu.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
