import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Toast, { showToast } from '../components/Toast';
import { CONTENTS } from '../data/contents';
import { trackClick } from '../utils/track';

/* ───── SVG 아이콘들 ───── */
function PlusIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function HeartIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function BellIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function ShareIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}
function SearchIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function DownloadIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function ThumbUpIcon({ size, color = '#fff', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.5" fill={filled ? color : 'none'}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
    </svg>
  );
}
function ThumbDownIcon({ size, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  );
}

const AD_TIME = 300; // 광고 위치 5분(초)

const DETAIL_TABS = [
  { id: 'btn_detail_tab_episode', label: '에피소드' },
  { id: 'btn_detail_tab_review', label: '리뷰' },
  { id: 'btn_detail_tab_recommend', label: '추천콘텐츠' },
  { id: 'btn_detail_tab_info', label: '상세정보' },
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const content = CONTENTS[id] || CONTENTS['smile'];

  /* ───── 플레이어 상태 ───── */
  const videoRef = useRef(null);
  const [currentEp, setCurrentEp] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(content.banners[0].showAt === 0);
  const [canClose, setCanClose] = useState(false);
  const controlsTimer = useRef(null);

  /* ───── 기존 Detail 상태 ───── */
  const [activeTab, setActiveTab] = useState('btn_detail_tab_episode');
  const [wished, setWished] = useState(false);
  const [liked, setLiked] = useState(false);
  const [notified, setNotified] = useState(false);
  const [reviewLikes, setReviewLikes] = useState(
    content.reviews.map(r => ({ likes: r.likes, liked: false, disliked: false }))
  );

  /* ───── 마운트 시 비디오 프리로드 ───── */
  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, []);

  /* ───── 배너 타이머 (단일 배너) ───── */
  useEffect(() => {
    if (!isPlaying) return;
    const showAt = (content.banners[0].showAt || 0) * 1000;
    const timers = [];
    if (showAt > 0) {
      timers.push(setTimeout(() => setShowAdBanner(true), showAt));
    }
    timers.push(setTimeout(() => setCanClose(true), showAt + 60 * 1000));
    return () => timers.forEach(clearTimeout);
  }, [isPlaying, content]);

  /* ───── 풀스크린 변경 감지 ───── */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* ───── 플레이어 함수 ───── */
  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function togglePlay() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }

  function handleTap() {
    if (showControls) return;
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  function hideControls() {
    clearTimeout(controlsTimer.current);
    setShowControls(false);
  }

  function toggleFullscreen() {
    const el = document.getElementById('video-wrapper');
    if (!isFullscreen) {
      el?.requestFullscreen?.();
      screen.orientation?.lock?.('landscape').catch(() => {});
    } else {
      document.exitFullscreen?.();
      screen.orientation?.unlock?.();
    }
  }

  /* ───── 리뷰 함수 ───── */
  function handleLike(i) {
    setReviewLikes(prev => prev.map((r, idx) => {
      if (idx !== i) return r;
      if (r.liked) return { ...r, likes: r.likes - 1, liked: false };
      return { ...r, likes: r.likes + 1, liked: true, disliked: false };
    }));
  }
  function handleDislike(i) {
    setReviewLikes(prev => prev.map((r, idx) => {
      if (idx !== i) return r;
      return { ...r, disliked: !r.disliked, liked: false };
    }));
  }

  return (
    <div style={{ background: '#111', minHeight: '100vh', paddingBottom: 80, color: '#fff' }}>
      <Toast />

      {/* ───── 인라인 비디오 플레이어 ───── */}
      <div
        id="video-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? '100vh' : 240,
          background: '#000',
          cursor: 'pointer',
        }}
        onClick={handleTap}
      >
        <video
          ref={videoRef}
          src={content.video}
          poster={content.detailThumb}
          style={{ width: '100%', height: '100%', objectFit: isFullscreen ? 'contain' : 'cover' }}
          onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={e => setDuration(e.target.duration)}
          onEnded={() => setIsPlaying(false)}
          playsInline
          preload="auto"
        />

        {/* 그라디언트 오버레이 (세로 모드만, 컨트롤이 보일 때만) */}
        {!isFullscreen && showControls && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, #111 100%)',
            pointerEvents: 'none',
            zIndex: 18,
          }} />
        )}

        {/* 컨트롤 오버레이 */}
        {showControls && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
            {/* 빈 영역 터치 시 즉시 숨김 */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', pointerEvents: 'auto', zIndex: 20 }}
              onClick={e => { e.stopPropagation(); hideControls(); }} />

            {/* 상단 바 */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', pointerEvents: 'auto', zIndex: 22 }}
              onClick={e => e.stopPropagation()}>
              <button id="btn_detail_back" onClick={() => { trackClick('btn_detail_back'); if (document.fullscreenElement) document.exitFullscreen?.(); navigate(-1); }}
                style={{ background: 'none', border: 'none', color: '#fff' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                </svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{content.title}</span>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {/* 전체화면 */}
                <button id="btn_detail_fullscreen" onClick={() => { trackClick('btn_detail_fullscreen', { isFullscreen }); toggleFullscreen(); }} style={{ background: 'none', border: 'none', color: '#fff', zIndex: 23 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    {isFullscreen
                      ? <><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></>
                      : <><path d="M3 7V3h4"/><path d="M21 7V3h-4"/><path d="M3 17v4h4"/><path d="M21 17v4h-4"/></>
                    }
                  </svg>
                </button>
                {/* 더보기 */}
                <button id="btn_detail_more" onClick={() => { trackClick('btn_detail_more'); showToast('준비 중'); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20 }}>⋮</button>
              </div>
            </div>

            {/* 중앙 컨트롤: ↺10 / 재생|일시정지 / ↻10 */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 36, pointerEvents: 'auto', zIndex: 22 }}
              onClick={e => e.stopPropagation()}>
              {/* 10초 뒤로 */}
              <button id="btn_detail_rewind" onClick={() => { trackClick('btn_detail_rewind'); if (videoRef.current) videoRef.current.currentTime -= 10; }}
                style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M6 18a12 12 0 1 1 2.4 7.2"/>
                  <path d="M6 12v6h6"/>
                  <text x="18" y="21" textAnchor="middle" fontSize="9" fill="#fff" stroke="none" fontWeight="600">10</text>
                </svg>
              </button>

              {/* 재생/일시정지 - 둥근 스타일 */}
              <button id="btn_detail_play_pause" onClick={() => { trackClick('btn_detail_play_pause', { isPlaying }); togglePlay(); }} style={{ background: 'none', border: 'none', color: '#fff' }}>
                {isPlaying
                  ? (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="#fff">
                      <rect x="5.5" y="4" width="4" height="16" rx="2" ry="2"/>
                      <rect x="14.5" y="4" width="4" height="16" rx="2" ry="2"/>
                    </svg>
                  ) : (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="#fff">
                      <path d="M6 4.75C6 3.784 7.052 3.2 7.857 3.73l12.5 7.25a1 1 0 0 1 0 1.74l-12.5 7.25C7.052 20.8 6 20.216 6 19.25V4.75z"/>
                    </svg>
                  )
                }
              </button>

              {/* 10초 앞으로 */}
              <button id="btn_detail_forward" onClick={() => { trackClick('btn_detail_forward'); if (videoRef.current) videoRef.current.currentTime += 10; }}
                style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M30 18a12 12 0 1 0-2.4 7.2"/>
                  <path d="M30 12v6h-6"/>
                  <text x="18" y="21" textAnchor="middle" fontSize="9" fill="#fff" stroke="none" fontWeight="600">10</text>
                </svg>
              </button>
            </div>

            {/* 하단 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 10px', pointerEvents: 'auto', zIndex: 22 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#fff' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              {/* 진행바 + 광고 마커 */}
              <div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
                {duration > 0 && AD_TIME < duration && (
                  <div style={{
                    position: 'absolute',
                    left: `${(AD_TIME / duration) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#FFD600',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }} />
                )}
                <input
                  type="range" min={0} max={duration || 100} value={currentTime}
                  onChange={e => {
                    const t = Number(e.target.value);
                    setCurrentTime(t);
                    if (videoRef.current) videoRef.current.currentTime = t;
                  }}
                  style={{ width: '100%', display: 'block', accentColor: '#1A6DFF' }}
                />
              </div>

              {/* 하단 버튼 행 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, width: '100%' }}>
                <button id="btn_detail_player_recommend" onClick={() => { trackClick('btn_detail_player_recommend'); showToast('추천 콘텐츠'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(30,30,30,0.85)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 8, fontSize: 11, cursor: 'pointer', flex: 1.5 }}>
                  <img src={content.episodes[0]?.thumb} alt="" style={{ width: 22, height: 22, borderRadius: 3, objectFit: 'cover', flexShrink: 0 }}/>
                  <span style={{ whiteSpace: 'nowrap' }}>추천 콘텐츠 ∧</span>
                </button>
                <button id="btn_detail_prev_ep" onClick={() => { trackClick('btn_detail_prev_ep', { currentEp }); if (currentEp > 0) { setCurrentEp(currentEp - 1); setCurrentTime(0); if (videoRef.current) videoRef.current.currentTime = 0; showToast(`${currentEp}화로 이동`); } else showToast('첫 번째 화입니다'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(30,30,30,0.85)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 8, fontSize: 11, cursor: 'pointer', flex: 1, whiteSpace: 'nowrap' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" flexShrink="0"><polygon points="19,5 9,12 19,19"/><rect x="5" y="5" width="2" height="14" fill="#fff"/></svg>
                  이전화
                </button>
                <button id="btn_detail_episode_list" onClick={() => { trackClick('btn_detail_episode_list'); if (document.fullscreenElement) document.exitFullscreen?.(); setActiveTab('btn_detail_tab_episode'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ background: 'rgba(30,30,30,0.85)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 8, fontSize: 11, cursor: 'pointer', flex: 1.2, whiteSpace: 'nowrap' }}>
                  에피소드 목록
                </button>
                <button id="btn_detail_next_ep" onClick={() => { trackClick('btn_detail_next_ep', { currentEp }); if (currentEp < content.episodes.length - 1) { setCurrentEp(currentEp + 1); setCurrentTime(0); if (videoRef.current) videoRef.current.currentTime = 0; showToast(`${currentEp + 2}화로 이동`); } else showToast('마지막 화입니다'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(30,30,30,0.85)', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: 8, fontSize: 11, cursor: 'pointer', flex: 1, whiteSpace: 'nowrap' }}>
                  다음화
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5,5 15,12 5,19"/><rect x="17" y="5" width="2" height="14" fill="#fff"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 광고 배너 (우하단) - 단일 배너 */}
        {showAdBanner && (
          <div style={{ position: 'absolute', bottom: showControls ? 54 : 12, right: 8, zIndex: 10 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* X버튼 행 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
                {canClose && (
                  <button
                    id="btn_detail_ad_close"
                    onClick={() => { trackClick('btn_detail_ad_close'); setShowAdBanner(false); }}
                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 16, height: 16, color: '#fff', fontSize: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >✕</button>
                )}
              </div>
              <button
                id={`btn_detail_ad_banner_${id}`}
                onClick={() => { trackClick(`btn_detail_ad_banner_${id}`, { url: content.banners[0].url }); window.open(content.banners[0].url, '_blank'); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block' }}
              >
                <img
                  src={content.banners[0].img}
                  alt="광고"
                  style={{ width: 144, height: 89, objectFit: 'contain', borderRadius: 8, display: 'block' }}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───── 콘텐츠 정보 (세로 모드만) ───── */}
      {!isFullscreen && (
        <>
          <div style={{ padding: '12px 16px 0' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{content.title}</h1>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 10 }}>
              {content.year} · {content.type} · {content.total} · {content.rating}
            </p>

            {/* 평점 + 인기 배지 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ color: '#FFD700', fontSize: 14 }}>★</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{content.score ?? '4.9'}</span>
              <span style={{ fontSize: 10, background: '#2A3442', color: '#fff', padding: '5px 10px', borderRadius: 4, fontWeight: 300 }}>
                {content.rank ?? '예능 인기 1위'}
              </span>
            </div>

            {/* 1화 이어보기 버튼 */}
            <button
              id={`btn_detail_play_${id}`}
              onClick={() => {
                trackClick(`btn_detail_play_${id}`, { contentId: id });
                if (videoRef.current) {
                  videoRef.current.play();
                  setIsPlaying(true);
                  setShowControls(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{
                width: '100%', background: '#1A6DFF', color: '#fff',
                padding: '14px 0', borderRadius: 8, fontWeight: 700, fontSize: 16, marginBottom: 22,
                border: 'none', cursor: 'pointer'
              }}
            >
              1화 이어보기
            </button>

            {/* 찜/좋아요/알림/공유 */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
              {[
                { id: 'btn_detail_wish', icon: <PlusIcon size={23} />, label: '찜하기', action: () => { trackClick('btn_detail_wish', { wished: !wished }); setWished(!wished); showToast(wished ? '찜하기 해제됨' : '찜하기 등록됨'); } },
                { id: 'btn_detail_like', icon: <HeartIcon size={21.5} />, label: '좋아요', action: () => { trackClick('btn_detail_like', { liked: !liked }); setLiked(!liked); showToast(liked ? '좋아요 해제됨' : '좋아요!'); } },
                { id: 'btn_detail_notif', icon: <BellIcon size={21.5} />, label: '알림받기', action: () => { trackClick('btn_detail_notif', { notified: !notified }); setNotified(!notified); showToast(notified ? '알림 해제됨' : '알림 설정됨'); } },
                { id: 'btn_detail_share', icon: <ShareIcon size={21.5} />, label: '공유하기', action: () => { trackClick('btn_detail_share'); showToast('공유 링크가 복사됐습니다'); } },
              ].map(btn => (
                <button key={btn.id} id={btn.id} onClick={btn.action}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', paddingBottom: 15 }}>
                  {btn.icon}
                  <span style={{ fontSize: 11, color: '#aaa' }}>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', borderBottom: '1px solid #222', position: 'sticky', top: 0, background: '#111', zIndex: 10 }}>
            {DETAIL_TABS.map(tab => (
              <button key={tab.id} id={tab.id} onClick={() => { trackClick(tab.id, { label: tab.label }); setActiveTab(tab.id); }}
                style={{
                  flex: 1, padding: '12px 0', fontSize: 14,
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  color: activeTab === tab.id ? '#fff' : '#666',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottomWidth: 2, borderBottomStyle: 'solid',
                  borderBottomColor: activeTab === tab.id ? '#fff' : 'transparent',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div style={{ padding: '16px' }}>

            {/* 에피소드 탭 */}
            {activeTab === 'btn_detail_tab_episode' && (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 25 }}>
                  {['전체 회차', '최신 순'].map((label, fi) => (
                    <button key={label} id={`btn_detail_ep_filter_${fi}`} onClick={() => trackClick(`btn_detail_ep_filter_${fi}`, { label })} style={{ flex: 1, padding: '6px 14px', borderRadius: 20, fontSize: 13, background: '#222', color: '#ccc', border: '1px solid #333', cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                  <button id="btn_detail_ep_search" onClick={() => trackClick('btn_detail_ep_search')} style={{ flex: 1.5, padding: '6px 14px', borderRadius: 20, fontSize: 13, background: '#222', color: '#ccc', border: '1px solid #333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 35 }}>
                    <SearchIcon size={14} />검색
                  </button>
                </div>

                {content.episodes.map(ep => (
                  <div key={ep.num} style={{ marginBottom: 30, borderBottom: '1px solid #222', paddingBottom: 18 }}>
                    <button
                      id={`btn_detail_ep_${ep.num}`}
                      onClick={() => {
                        trackClick(`btn_detail_ep_${ep.num}`, { epNum: ep.num, epTitle: ep.title });
                        if (videoRef.current) {
                          videoRef.current.play();
                          setIsPlaying(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
                      <img src={ep.thumb} alt={ep.title} style={{ width: 120, height: 72, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{ep.num}. {ep.title}</p>
                        <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{ep.date} · {ep.runtime}</p>
                      </div>
                      <button id={`btn_detail_ep_download_${ep.num}`} onClick={e => { e.stopPropagation(); trackClick(`btn_detail_ep_download_${ep.num}`, { epNum: ep.num }); showToast('다운로드 준비 중입니다'); }}
                        style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', flexShrink: 0 }}>
                        <DownloadIcon size={21.5} />
                      </button>
                    </button>
                    <p style={{ fontSize: 13, color: '#aaa', marginTop: 15, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{ep.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'btn_detail_tab_review' && (
              <div>
                <div style={{ background: '#1C2024', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#FFD700', fontSize: 22 }}>★</span>)}
                    </div>
                    <p style={{ fontSize: 13, color: '#888' }}>{content.reviewCount}</p>
                  </div>
                  <span style={{ fontSize: 40, fontWeight: 700 }}>4.9</span>
                </div>

                {content.reviews.map((r, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#FFD700', fontSize: 13 }}>★</span>)}
                        </div>
                        <span style={{ fontSize: 12, color: '#888' }}>· {r.date}</span>
                      </div>
                      <button id={`btn_detail_review_more_${i}`} style={{ background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer' }}>⋮</button>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7B2FBE', marginBottom: 8 }} />
                    <p style={{ fontSize: 14, color: '#ddd', lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-line' }}>{r.text}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button id={`btn_detail_review_like_${i}`} onClick={() => { trackClick(`btn_detail_review_like_${i}`, { index: i }); handleLike(i); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#222', border: 'none', color: reviewLikes[i].liked ? '#1A6DFF' : '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}>
                        <ThumbUpIcon size={16} color="#fff" filled={reviewLikes[i].liked} />
                        {reviewLikes[i].likes.toLocaleString()}
                      </button>
                      <button id={`btn_detail_review_dislike_${i}`} onClick={() => { trackClick(`btn_detail_review_dislike_${i}`, { index: i }); handleDislike(i); }}
                        style={{ background: '#222', border: 'none', padding: '6px 14px', borderRadius: 20, cursor: 'pointer' }}>
                        <ThumbDownIcon size={16} color={reviewLikes[i].disliked ? '#1A6DFF' : '#fff'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 추천콘텐츠 탭 */}
            {activeTab === 'btn_detail_tab_recommend' && (
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 15 }}>회원님이 좋아할만한 콘텐츠</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 30 }}>
                  {[
                    { src: '/assets/poster_drama.png', id: 'drama' },
                    { src: '/assets/poster_bookstore.png', id: null },
                    { src: '/assets/poster_15focus.png', id: 'focus' },
                  ].map((item, i) => (
                    <button key={i} id={`btn_detail_rec_${item.id || i}`} onClick={() => { trackClick(`btn_detail_rec_${item.id || i}`, { contentId: item.id }); item.id ? navigate(`/detail/${item.id}`) : showToast('준비 중입니다'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <img src={item.src} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 6 }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 15 }}>스포츠 예능</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { src: '/assets/poster_extra.png', id: 'extra' },
                    { src: '/assets/poster_nextlegend.png', id: null },
                    { src: '/assets/poster_soccer.png', id: null },
                  ].map((item, i) => (
                    <button key={i} id={`btn_detail_rec_sports_${item.id || i}`} onClick={() => { trackClick(`btn_detail_rec_sports_${item.id || i}`, { contentId: item.id }); item.id ? navigate(`/detail/${item.id}`) : showToast('준비 중입니다'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <img src={item.src} alt="" style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 6 }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 상세정보 탭 */}
            {activeTab === 'btn_detail_tab_info' && (
              <div style={{ fontSize: 14, color: '#ccc', lineHeight: 2 }}>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>시놉시스</p>
                  <p style={{ color: '#888', marginBottom: 6 }}>{content.schedule}</p>
                  <p style={{ color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{content.synopsis}</p>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: '#ccc', fontWeight: 700, lineHeight: 2, whiteSpace: 'pre-line' }}>출연진</p>
                  <p style={{ color: '#ccc', lineHeight: 2, whiteSpace: 'pre-line' }}>{content.cast}</p>
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>감독</p>
                  <p style={{ color: '#ccc' }}>{content.director}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!isFullscreen && <BottomNav />}
    </div>
  );
}