import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Toast, { showToast } from '../components/Toast';
import { trackClick } from '../utils/track';

const TOP_TABS = [
  { id: 'btn_main_tab_spang', label: '스팡', path: '/spang' },
  { id: 'btn_main_tab_tv', label: 'TV', path: null },
  { id: 'btn_main_tab_movie', label: '영화', path: null },
  { id: 'btn_main_tab_sports', label: '스포츠', path: null },
  { id: 'btn_main_tab_live', label: '라이브', path: null },
];

const BOTTOM_BANNERS = [
  { id: 'btn_main_banner_bakery', img: '/assets/program_bakery.png', action: 'toast', msg: '준비 중입니다' },
  { id: 'btn_main_banner_dessert', img: '/assets/bakery_cp_item.png', action: 'link', url: 'https://pages.coupang.com/p/169503?sourceType=oms_share' },
  { id: 'btn_main_banner_tteok', img: '/assets/otoki_cp_item.png', action: 'link', url: 'https://web.coupangeats.com/share?storeId=449022&dishId&key=69e31288-77f8-4225-a659-1fa1845fb06b' },
  { id: 'btn_main_banner_predict', img: '/assets/sports_pass_event.png', action: 'page', path: '/pass-detail' },
];

export default function MainHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('btn_main_tab_spang');

  function handleTab(tab) {
    trackClick(tab.id, { label: tab.label });
    setActiveTab(tab.id);
    if (tab.path) navigate(tab.path);
    else showToast('준비 중입니다');
  }

  function handleBanner(banner) {
    trackClick(banner.id, { action: banner.action });
    if (banner.action === 'toast') showToast(banner.msg);
    else if (banner.action === 'link') window.open(banner.url, '_blank');
    else if (banner.action === 'page') navigate(banner.path);
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
          id="btn_main_header_category"
          onClick={() => { trackClick('btn_main_header_category'); showToast('준비 중입니다'); }}
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
            onClick={() => handleTab(tab)}
            style={{
              flexShrink: 0, padding: '8px 18px', fontSize: 14, fontWeight: 600,
              boxSizing: 'border-box', transition: 'all 0.2s',
              ...(activeTab === tab.id && tab.id === 'btn_main_tab_spang'
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
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    color: activeTab === tab.id ? '#000' : '#fff',
                  }
              ),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 메인 포스터 카드 */}
      <div style={{ margin: '0 16px', borderRadius: 14, overflow: 'hidden', position: 'relative', border: '1px solid rgba(81, 81, 81, 0.5)' }}>

        {/* 시리즈 뱃지 - 좌상단 코너에 딱 붙게 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, zIndex: 2,
          background: '#0075FF', borderRadius: '0 0 8px 0', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700,
        }}>
          <img src="/assets/coupangplay_logo.png" alt="" style={{ height: 14, objectFit: 'contain', filter: 'brightness(10)' }} />
          시리즈
        </div>

        {/* 메인 포스터 이미지 */}
        <button id="btn_main_hero_smile" onClick={() => navigate('/detail/smile')} style={{ position: 'relative', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
          <img
            src="/assets/img_Main_home.png"
            alt="SNL Korea"
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
          />
          {/* 하단 그라데이션 오버레이 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.95))' }} />

          {/* 포스터 위 텍스트 + 버튼 오버레이 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 16px' }}>
            <img
              src="/assets/snl_logo.png"
              alt="SNL Korea"
              style={{ height: 50, objectFit: 'contain', marginBottom: 8, display: 'block' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ color: '#FFD600', fontSize: 15 }}>★</span>
              <span style={{ fontSize: 13, color: '#ddd' }}>4.3 · 예능 · 1시간 21분</span>
            </div>
            <button
              id="btn_main_hero_play_smile"
              onClick={e => { e.stopPropagation(); trackClick('btn_main_hero_play_smile', { contentId: 'smile' }); navigate('/detail/smile'); }}
              style={{
                width: '100%', background: '#0075FF', color: '#fff',
                padding: '13px 0', borderRadius: 8, fontWeight: 700, fontSize: 16,
              }}
            >
              재생하기
            </button>
          </div>
        </button>
      </div>

      {/* 하단 배너 4개 - 한 화면에 다 보이게 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '12px 16px 0' }}>
        {BOTTOM_BANNERS.map(banner => (
          <button
            key={banner.id}
            id={banner.id}
            onClick={() => handleBanner(banner)}
            style={{ borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#111', aspectRatio: '1/1' }}
          >
            <img
              src={banner.img}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

