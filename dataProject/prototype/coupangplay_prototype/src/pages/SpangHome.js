import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Toast, { showToast } from '../components/Toast';
import { HOME_CATEGORIES, CONTENTS } from '../data/contents';
import { trackClick } from '../utils/track';

const TOP_TABS = [
  { id: 'btn_spang_tab_spang', label: '스팡', active: true },
  { id: 'btn_spang_tab_tv', label: 'TV' },
  { id: 'btn_spang_tab_movie', label: '영화' },
  { id: 'btn_spang_tab_sports', label: '스포츠' },
  { id: 'btn_spang_tab_live', label: '라이브' },
];

const MAIN_BANNERS = [
  { img: '/assets/banner_main_rolling_01.png', logo: '/assets/banner_main_rolling_01_logo.png', contentId: 'smile', logoHeight: 100, info: '오리지널 예능 · 13분', rating: '4.9' },
  { img: '/assets/banner_main_rolling_04.png', logo: '/assets/banner_main_rolling_04_logo.png', contentId: 'drama', logoHeight: 70, info: '드라마 · 13분', rating: '4.9' },   // ← drama로
  { img: '/assets/banner_main_rolling_02.png', logo: '/assets/banner_main_rolling_02_logo.png', contentId: 'extra', logoHeight: 70, info: '스포츠 예능 · 15분', rating: '4.9' },
  { img: '/assets/banner_main_rolling_03.png', logo: '/assets/banner_main_rolling_03_logo.png', contentId: 'focus', logoHeight: 70, info: '교양 · 15분', rating: '4.9' },   // ← focus로
];

const CAT_KEYS = {
  '새로 올라온 스팡 콘텐츠': 'new',
  '오리지널 예능': 'orig',
  '스포츠 예능': 'sports',
  '드라마': 'drama',
  '일상의 깊이를 더하는 지적 플렉스': 'flex',
};

export default function SpangHome() {
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeTopTab, setActiveTopTab] = useState('btn_spang_tab_spang');
  const bannerScrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (bannerScrollRef.current) {
        const width = bannerScrollRef.current.offsetWidth;
        const maxScroll = width * (MAIN_BANNERS.length - 1);
        const next = bannerScrollRef.current.scrollLeft >= maxScroll ? 0 : bannerScrollRef.current.scrollLeft + width;
        bannerScrollRef.current.scrollTo({ left: next, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  function handleBannerScroll() {
    if (bannerScrollRef.current) {
      const width = bannerScrollRef.current.offsetWidth;
      const idx = Math.round(bannerScrollRef.current.scrollLeft / width);
      setBannerIdx(idx);
    }
  }

  function handleDotClick(i) {
    trackClick(`btn_spang_banner_dot_${i}`, { index: i });
    if (bannerScrollRef.current) {
      const width = bannerScrollRef.current.offsetWidth;
      bannerScrollRef.current.scrollTo({ left: i * width, behavior: 'smooth' });
    }
    setBannerIdx(i);
  }

  function handleTopTab(tab) {
    trackClick(tab.id, { label: tab.label });
    setActiveTopTab(tab.id);
    if (tab.id !== 'btn_spang_tab_spang') showToast('준비 중입니다');
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 80 }}>
      <Toast />
      {/* 상단 로고 + 카테고리 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="/assets/coupangplay_logo.png" alt="아이콘" style={{ height: 22, objectFit: 'contain' }} />
          <img src="/assets/coupangplay.png" alt="쿠팡플레이" style={{ height: 16, objectFit: 'contain' }} />
        </div>
        <button
          id="btn_spang_header_category"
          onClick={() => { trackClick('btn_spang_header_category'); showToast('준비 중입니다'); }}
          style={{
            display: 'flex',
            width: '77.634px',
            height: '27.099px',
            paddingLeft: '5px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.197px',
            flexShrink: 0,
            borderRadius: '3.662px',
            background: '#373436',
            border: 'none',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          카테고리 ▾
        </button>
      </div>

      {/* 상단 탭 */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TOP_TABS.map(tab => (
          <button
            key={tab.id}
            id={tab.id}
            onClick={() => handleTopTab(tab)}
            style={{
              flexShrink: 0, padding: '8px 18px', fontSize: 14, fontWeight: 600,
              boxSizing: 'border-box', transition: 'all 0.2s',
              ...(activeTopTab === tab.id && tab.id === 'btn_spang_tab_spang'
                ? {
                    borderRadius: '16.45px',
                    border: '1px solid transparent',
                    color: '#fff',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.18) 44.33%, rgba(255,255,255,0.28) 100%)',
                    boxShadow: '0 0.7px 1.5px 1px rgba(255,255,255,0.2) inset, 0 -8px 18px 1px rgba(255,255,255,0.05) inset, 0 8px 22px 0 rgba(255,255,255,0.20), 0 4px 14px 0 rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(11px)',
                  }
                : {
                    borderRadius: 20,
                    border: '1px solid #444',
                    background: activeTopTab === tab.id ? '#fff' : 'transparent',
                    color: activeTopTab === tab.id ? '#000' : '#fff',
                  }
              ),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 메인 배너 슬라이더 */}
      <div style={{ margin: '0 16px', borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(81,81,81,0.5)' }}>
        {/* 스팡 뱃지 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, zIndex: 10,
          background: '#0075FF', borderRadius: '0 0 8px 0', padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none',
        }}>
          <img src="/assets/badge_logo.png" alt="" style={{ height: 12, objectFit: 'contain' }} />
          <img src="/assets/spang_logo.png" alt="spang" style={{ height: 12, objectFit: 'contain' }} />
        </div>

        {/* 가로 스와이프 배너 */}
        <div
          ref={bannerScrollRef}
          onScroll={handleBannerScroll}
          style={{ display: 'flex', overflowX: 'scroll', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MAIN_BANNERS.map((banner, idx) => (
            <button
              key={idx}
              id={`btn_spang_banner_${banner.contentId}_${idx}`}
              onClick={() => navigate(`/detail/${banner.contentId}`)}
              style={{ flex: '0 0 100%', scrollSnapAlign: 'start', position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
            >
              <img
                src={banner.img}
                alt="메인 배너"
                style={{ width: '100%', height: 408, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.95))' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 16px' }}>
                <img src={banner.logo} alt="로고" style={{ height: banner.logoHeight, objectFit: 'contain', marginBottom: 10, display: 'block' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ color: '#FFD600', fontSize: 15 }}>★</span>
                  <span style={{ fontSize: 13, color: '#ddd' }}>{banner.rating} · {banner.info}</span>
                </div>
                <button
                  id={`btn_spang_banner_play_${banner.contentId}_${idx}`}
                  onClick={e => { e.stopPropagation(); trackClick(`btn_spang_banner_play_${banner.contentId}`, { contentId: banner.contentId }); navigate(`/detail/${banner.contentId}`); }}
                  style={{
                    width: '100%', background: '#0075FF', color: '#fff',
                    padding: '13px 0', borderRadius: 8, fontWeight: 700, fontSize: 16,
                    border: 'none', boxSizing: 'border-box',
                  }}
                >
                  재생하기
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 배너 dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10, marginBottom: 25 }}>
        {MAIN_BANNERS.map((_, i) => (
          <button key={i} id={`btn_spang_banner_dot_${i}`} onClick={() => handleDotClick(i)}
            style={{ width: i === bannerIdx ? 30 : 13, height: 6, borderRadius: 5, background: i === bannerIdx ? '#fff' : '#555', transition: 'all 0.3s', border: 'none' }} />
        ))}
      </div>

      {/* 회원님이 좋아할 만한 콘텐츠 */}
      {HOME_CATEGORIES.slice(0, 1).map((cat) => (
        <div key={cat.label} style={{ marginBottom: 28 }}>
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{cat.label}</h3>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingLeft: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {cat.items.map((item, idx) => (
              <button key={idx} id={`btn_spang_like_${item.contentId}_${idx}`} onClick={() => { trackClick(`btn_spang_like_${item.contentId}`, { contentId: item.contentId, category: cat.label }); navigate(`/detail/${item.contentId}`); }} style={{ flexShrink: 0, width: 110, textAlign: 'left' }}>
                <div style={{ width: 110, height: 160, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 이번 주 스팡 TOP 10 */}
      <div style={{ padding: '0 16px 24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>이번 주 스팡 TOP 10</h3>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            ...Object.values(CONTENTS),
            { id: 'soccer',     poster: '/assets/poster_soccer.png' },
            { id: 'bakery',     poster: '/assets/poster_bakery.png' },
            { id: 'love',       poster: '/assets/poster_love.png' },
            { id: 'textbook',   poster: '/assets/poster_textbook.png' },
            { id: 'romance',    poster: '/assets/poster_romance.png' },
            { id: 'nextlegend', poster: '/assets/poster_nextlegend.png' },
          ].map((c, i) => (
            <button key={c.id} id={`btn_spang_top10_${c.id}`} onClick={() => { trackClick(`btn_spang_top10_${c.id}`, { contentId: c.id, rank: i + 1 }); navigate(`/detail/${c.id}`); }} style={{ flexShrink: 0, width: 110, textAlign: 'left', position: 'relative' }}>
              <div style={{ width: 110, height: 160, borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
                <img src={c.poster} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ position: 'absolute', bottom: -10, left: -2, fontSize: 55, fontWeight: 900, color: 'rgba(255,255,255,0.85)' }}>{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 나머지 카테고리 */}
      {HOME_CATEGORIES.slice(1).map((cat) => (
        <div key={cat.label} style={{ marginBottom: 28 }}>
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{cat.label}</h3>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingLeft: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {cat.items.map((item, idx) => (
              <button key={idx} id={`btn_spang_${CAT_KEYS[cat.label] || 'cat'}_${item.contentId}_${idx}`} onClick={() => { trackClick(`btn_spang_${CAT_KEYS[cat.label] || 'cat'}_${item.contentId}`, { contentId: item.contentId, category: cat.label }); navigate(`/detail/${item.contentId}`); }} style={{ flexShrink: 0, width: 110, textAlign: 'left' }}>
                <div style={{ width: 110, height: 160, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {cat.label === '새로 올라온 스팡 콘텐츠' && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0,
                      background: '#0075FF', borderRadius: '0 0 4px 0', padding: '3px 6px',
                      fontSize: 9, fontWeight: 400, color: '#fff',
                    }}>
                      NEW
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

            <BottomNav />
    </div>
  );
}