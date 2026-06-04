// Detail.js에 병합 
// router도 주석처리 해놓은 상태

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Toast, { showToast } from '../components/Toast';
import { CONTENTS } from '../data/contents';
import { trackClick } from '../utils/track';

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const content = CONTENTS[id] || CONTENTS['smile'];
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(900); // 15분 기본값
  const [showControls, setShowControls] = useState(true);
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [showSubtitlePop, setShowSubtitlePop] = useState(false);
  const [showSpeedPop, setShowSpeedPop] = useState(false);
  const [showRatioPop, setShowRatioPop] = useState(false);
  const [showEpisodePop, setShowEpisodePop] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedSub, setSelectedSub] = useState('자막없음');
  const [selectedSpeed, setSelectedSpeed] = useState('1.0x');
  const controlsTimer = useRef(null);

  const SUBTITLES = ['자막없음', '한국어 (SDH)', '영어', '중국어'];
  const SPEEDS = ['0.5x', '0.75x', '1.0x', '1.25x', '1.5x', '2.0x'];

  useEffect(() => {
    // 시간 시뮬레이션 (실제 영상 없을 때)
    const timer = setInterval(() => {
      if (isPlaying) setCurrentTime(t => Math.min(t + 1, duration));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function togglePlay() {
    setIsPlaying(p => !p);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  }

  function handleTap() {
    if (isLocked) return;
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  function toggleFullscreen() {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
      screen.orientation?.lock?.('landscape').catch(() => {});
    } else {
      document.exitFullscreen?.();
      screen.orientation?.unlock?.();
    }
    setIsFullscreen(f => !f);
  }

  function closePopups() {
    setShowSubtitlePop(false);
    setShowSpeedPop(false);
    setShowRatioPop(false);
    setShowEpisodePop(false);
  }

  const anyPopup = showSubtitlePop || showSpeedPop || showRatioPop || showEpisodePop;

  return (
    <div style={{
      background: '#000', minHeight: '100vh',
      ...(isFullscreen ? { position: 'fixed', inset: 0, zIndex: 9999 } : {})
    }}>
      <Toast />

      {/* 영상 영역 */}
      <div
        style={{ position: 'relative', width: '100%', height: isFullscreen ? '100vh' : 220, background: '#111', cursor: 'pointer' }}
        onClick={handleTap}
      >
        {/* 실제 영상 */}
        <video
          ref={videoRef}
          src={`/assets/${id === 'smile' ? 'video_smile' : id === 'focus' ? 'video_15focus' : id === 'extra' ? 'video_extra' : 'video_drama'}.mp4`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={e => setDuration(e.target.duration)}
          playsInline
        />

        {/* 화면 잠금 상태 */}
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button id="btn_player_unlock" onClick={() => { trackClick('btn_player_unlock'); setIsLocked(false); showToast('화면 잠금 해제됨'); }}
              style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 20, fontSize: 13, color: '#fff' }}>
              🔒 잠금 해제
            </button>
          </div>
        )}

        {/* 컨트롤 오버레이 */}
        {showControls && !isLocked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>

            {/* 상단 바 */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
              <button id="btn_player_close" onClick={() => { trackClick('btn_player_close'); document.exitFullscreen?.(); navigate(-1); }}
                style={{ fontSize: 22, color: '#fff' }}>✕</button>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{content.title}</p>
                <p style={{ fontSize: 11, color: '#ccc' }}>1. {content.episodes[0].title}</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button id="btn_player_subtitle" onClick={(e) => { e.stopPropagation(); trackClick('btn_player_subtitle'); closePopups(); setShowSubtitlePop(true); }}
                  style={{ fontSize: 11, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>㉿</span>자막
                </button>
                <button id="btn_player_speed" onClick={(e) => { e.stopPropagation(); trackClick('btn_player_speed'); closePopups(); setShowSpeedPop(true); }}
                  style={{ fontSize: 11, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>⏱</span>속도
                </button>
                <button id="btn_player_aspect_ratio" onClick={(e) => { e.stopPropagation(); trackClick('btn_player_aspect_ratio'); closePopups(); setShowRatioPop(true); }}
                  style={{ fontSize: 11, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>⊞</span>비율
                </button>
                <button id="btn_player_lock" onClick={(e) => { e.stopPropagation(); trackClick('btn_player_lock'); setIsLocked(true); showToast('화면이 잠겼습니다'); }}
                  style={{ fontSize: 11, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>🔒</span>잠금
                </button>
              </div>
            </div>

            {/* 중앙 재생 버튼 */}
            <button id="btn_player_play" onClick={() => { trackClick('btn_player_play', { isPlaying }); togglePlay(); }}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 42 }}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* 하단 컨트롤 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 12px' }}>
              {/* 진행바 */}
              <input type="range" min={0} max={duration} value={currentTime}
                onChange={e => { setCurrentTime(Number(e.target.value)); if(videoRef.current) videoRef.current.currentTime = e.target.value; }}
                style={{ width: '100%', marginBottom: 6, accentColor: '#E50914' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#ccc' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button id="btn_player_prev_episode" onClick={() => { trackClick('btn_player_prev_episode'); showToast('이전 화로 이동합니다'); }}>⏮</button>
                  <button id="btn_player_episode_list" onClick={(e) => { e.stopPropagation(); trackClick('btn_player_episode_list'); closePopups(); setShowEpisodePop(true); }}>☰</button>
                  <button id="btn_player_next_episode" onClick={() => { trackClick('btn_player_next_episode'); showToast('다음 화로 이동합니다'); }}>⏭</button>
                  <button id="btn_player_fullscreen" onClick={() => { trackClick('btn_player_fullscreen', { isFullscreen }); toggleFullscreen(); }}>{isFullscreen ? '⊡' : '⛶'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 광고 배너 (좌하단) */}
        {showAdBanner && !isLocked && (
          <div style={{ position: 'absolute', bottom: 50, left: 8, display: 'flex', alignItems: 'center', gap: 0, zIndex: 10 }}>
            <button id="btn_ad_banner" onClick={() => { trackClick('btn_ad_banner', { url: content.banner.url }); window.open(content.banner.url, '_blank'); }}
              style={{ borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.7)', maxWidth: 180 }}>
              <img src={content.banner.img} alt="광고" style={{ width: 48, height: 48, objectFit: 'cover' }} />
              <span style={{ fontSize: 10, color: '#fff', padding: '0 6px', lineHeight: 1.3 }}>{content.banner.text}</span>
            </button>
            <button id="btn_ad_close" onClick={() => { trackClick('btn_ad_close'); setShowAdBanner(false); }}
              style={{ marginLeft: 4, color: '#fff', fontSize: 14, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 하단 상세정보 (세로 모드) */}
      {!isFullscreen && (
        <div style={{ padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{content.title}</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>1화 · {content.episodes[0].title} · {content.episodes[0].runtime}</p>
          <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, marginBottom: 20 }}>{content.episodes[0].desc}</p>

          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>다음 에피소드</h3>
          {content.episodes.slice(1).map(ep => (
            <button key={ep.num} id={`btn_next_ep_${ep.num}`} style={{ width: '100%', display: 'flex', gap: 12, marginBottom: 12, textAlign: 'left' }}
              onClick={() => { trackClick(`btn_next_ep_${ep.num}`, { epNum: ep.num, epTitle: ep.title }); showToast('재생 중...'); }}>
              <img src={ep.thumb} alt={ep.title} style={{ width: 120, height: 68, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{ep.num}. {ep.title}</p>
                <p style={{ fontSize: 12, color: '#888' }}>{ep.date} · {ep.runtime}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 팝업들 */}
      {anyPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }} onClick={closePopups}>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, background: '#1a1a1a', borderRadius: '16px 16px 0 0', padding: 20 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                {showSubtitlePop ? '자막' : showSpeedPop ? '재생 속도' : showRatioPop ? '화면 비율' : '에피소드 목록'}
              </h3>
              <button id="btn_popup_close" onClick={() => { trackClick('btn_popup_close'); closePopups(); }}>✕</button>
            </div>

            {showSubtitlePop && (
              <div>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>자막</p>
                {SUBTITLES.map(s => (
                  <button key={s} id={`btn_sub_${s}`} onClick={() => { trackClick(`btn_sub_${s}`, { subtitle: s }); setSelectedSub(s); closePopups(); showToast(`자막: ${s}`); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid #333', fontSize: 15 }}>
                    <span>{s}</span>
                    {selectedSub === s && <span style={{ color: '#E50914' }}>✓</span>}
                  </button>
                ))}
                <p style={{ fontSize: 13, color: '#888', marginTop: 16, marginBottom: 12 }}>음성 언어</p>
                {['한국어', '영어'].map(lang => (
                  <button key={lang} id={`btn_lang_${lang}`} onClick={() => trackClick(`btn_lang_${lang}`, { lang })} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid #333', fontSize: 15 }}>
                    <span>{lang}</span>
                    {lang === '한국어' && <span style={{ color: '#E50914' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {showSpeedPop && (
              <div>
                {SPEEDS.map(sp => (
                  <button key={sp} id={`btn_speed_${sp}`} onClick={() => { trackClick(`btn_speed_${sp}`, { speed: sp }); setSelectedSpeed(sp); closePopups(); showToast(`재생 속도: ${sp}`); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid #333', fontSize: 15 }}>
                    <span>{sp}</span>
                    {selectedSpeed === sp && <span style={{ color: '#E50914' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {showRatioPop && (
              <div>
                {['화면에 맞추기', '원본 비율', '꽉 채우기'].map(r => (
                  <button key={r} id={`btn_ratio_${r}`} onClick={() => { trackClick(`btn_ratio_${r}`, { ratio: r }); closePopups(); showToast(`화면 비율: ${r}`); }}
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid #333', fontSize: 15 }}>
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            )}

            {showEpisodePop && (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {content.episodes.map(ep => (
                  <button key={ep.num} id={`btn_ep_popup_${ep.num}`} onClick={() => { trackClick(`btn_ep_popup_${ep.num}`, { epNum: ep.num }); closePopups(); showToast(`${ep.num}화 재생 중...`); }}
                    style={{ display: 'flex', gap: 12, width: '100%', padding: '12px 0', borderBottom: '1px solid #333', textAlign: 'left' }}>
                    <img src={ep.thumb} alt={ep.title} style={{ width: 80, height: 45, borderRadius: 4, objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{ep.num}. {ep.title}</p>
                      <p style={{ fontSize: 11, color: '#888' }}>{ep.runtime}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
