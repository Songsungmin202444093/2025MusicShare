'use client'

import { useState, useRef, useEffect } from 'react'

export default function MusicPlayer({ currentTrack, playlist = [] }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none') // 'none', 'one', 'all'
  const audioRef = useRef(null)

  // 기본 트랙 (플레이어가 표시되도록)
  const track = currentTrack || {
    id: '1',
    title: 'NewJeans - Get Up',
    artist: 'NewJeans',
    thumb: 'https://picsum.photos/seed/nj/640/360'
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // TODO: 실제 오디오 재생/일시정지 로직
  }

  const handlePrevious = () => {
    // TODO: 이전 곡 로직
    console.log('이전 곡')
  }

  const handleNext = () => {
    // TODO: 다음 곡 로직
    console.log('다음 곡')
  }

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration
    setCurrentTime(newTime)
    // TODO: 실제 오디오 시간 변경
  }

  const handleVolumeChange = (e) => {
    setVolume(e.target.value)
    // TODO: 실제 오디오 볼륨 변경
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }

  // 시뮬레이션: 재생 시간 업데이트
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= 180) { // 3분으로 가정
            setIsPlaying(false)
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // 시뮬레이션: 총 재생 시간 설정
  useEffect(() => {
    setDuration(180) // 3분으로 가정
    setCurrentTime(0)
  }, [track])

  return (
    <div className="music-player">
      <div className="player-container">
        {/* 왼쪽: 현재 재생 중인 트랙 정보 */}
        <div className="player-track">
          <div className="track-thumb">
            <img src={track.thumb} alt={track.title} />
          </div>
          <div className="track-info">
            <div className="track-title">{track.title}</div>
            <div className="track-artist">{track.artist}</div>
          </div>
          <button className="track-like">♥</button>
        </div>

        {/* 중앙: 재생 컨트롤 */}
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="셔플"
            >
              🔀
            </button>
            <button className="control-btn" onClick={handlePrevious} title="이전">
              ⏮️
            </button>
            <button className="play-btn" onClick={togglePlay} title={isPlaying ? '일시정지' : '재생'}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="control-btn" onClick={handleNext} title="다음">
              ⏭️
            </button>
            <button 
              className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`}
              onClick={toggleRepeat}
              title={`반복: ${repeatMode === 'none' ? '없음' : repeatMode === 'all' ? '전체' : '한곡'}`}
            >
              {repeatMode === 'one' ? '🔂' : '🔁'}
            </button>
          </div>

          <div className="progress-container">
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleProgressChange}
                className="progress-slider"
              />
            </div>
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 오른쪽: 볼륨 및 기타 컨트롤 */}
        <div className="player-volume">
          <button className="volume-btn">🔊</button>
          <div className="volume-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          <button className="fullscreen-btn" title="전체화면">📺</button>
        </div>
      </div>
    </div>
  )
}