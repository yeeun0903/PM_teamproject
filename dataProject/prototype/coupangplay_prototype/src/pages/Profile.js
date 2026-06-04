import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Toast, { showToast } from '../components/Toast';
import { trackClick } from '../utils/track';

const WISHLIST = [
  { id: 'soccer', img: '/assets/poster_soccer.png' },
  { id: 'bakery', img: '/assets/poster_bakery.png' },
  { id: 'nextlegend', img: '/assets/poster_nextlegend.png' },
  { id: 'textbook', img: '/assets/poster_textbook.png' },
];

const RECOMMEND = [
  { id: 'smile', img: '/assets/poster_smile.png' },
  { id: 'focus', img: '/assets/poster_15focus.png' },
  { id: 'extra', img: '/assets/poster_extra.png' },
  { id: 'drama', img: '/assets/poster_drama.png' },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 80 }}>
      <Toast />

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="/assets/coupangplay_logo.png" alt="아이콘" style={{ height: 22, objectFit: 'contain' }} />
          <img src="/assets/coupangplay.png" alt="쿠팡플레이" style={{ height: 16, objectFit: 'contain' }} />
        </div>
      </div>

      {/* 프로필 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 44.5, height: 44.5, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00437f 90%, #FFFFFF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            JM
          </div>
          <div style={{ marginLeft: 14 }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>김지민</p>
            <p style={{ fontSize: 12, color: '#4A90FF', fontWeight: 400 }}>WOW! 와우회원</p>
          </div>
        </div>
        <button id="btn_profile_header_settings" onClick={() => { trackClick('btn_profile_header_settings'); navigate('/settings'); }} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 16px' }}>

      {/* 더블패스 카드 */}
      <div style={{
        background: 'linear-gradient(120deg, #36D0F7 0%, #3DACDC 60%, #FF8F3D 100%)',
        borderRadius: 12, padding: '15px 18px', marginBottom: 12, height: 90, position: 'relative', overflow: 'hidden',
      }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>내 패스</p>
        <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 5 }}>
          <span style={{ fontWeight: 800 }}>더블패스</span>
          <span style={{ fontWeight: 400 }}> 이용 중</span>
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['스포츠', '파라마운트+'].map(tag => (
            <span key={tag} style={{
              background: '#ffffff', borderRadius: 20,
              padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#3DACDC'
            }}>{tag}</span>
          ))}
        </div>
        {/* 티켓 아이콘 장식 */}
        <img src="/assets/ticket.png" alt="" style={{
          position: 'absolute', right: 16, top: '50%',
          transform: 'translateY(-50%) rotate(-20deg)',
          width: 150, opacity: 0.3, pointerEvents: 'none',
        }} />
      </div>

        {/* 쿠팡캐시 카드 */}
        <div style={{ 
          background: 'linear-gradient(150deg, #0B1220 100%, #05070C 100%)', 
          borderRadius: 12, 
          padding: '16px 20px', 
          marginBottom: 20,
          height: 114,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* 코인 이미지 - 뒤로 */}
          <img src="/assets/img_profile.png" alt="" style={{ 
            position: 'absolute', right: 0, top: '50%',
            transform: 'translateY(-50%)',
            width: 83.92, height: 91.55, opacity: 0.6,
            zIndex: 0,
          }} />

          {/* 콘텐츠 - 앞으로 */}
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 0 }}>보유 쿠팡캐시</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#36D0F7' }}>3,200원</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                id="btn_profile_cash_coupon"
                onClick={() => { trackClick('btn_profile_cash_coupon'); window.open('https://www.coupang.com', '_blank'); }}
                style={{
                  flex: 1, background: '#0B1220',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                쿠팡에서 사용하기
              </button>
              <button
                id="btn_profile_cash_eats"
                onClick={() => { trackClick('btn_profile_cash_eats'); window.open('https://web.coupangeats.com/share?storeId=756683&dishId=107238778&key=4e00e7af-4bf7-4e17-8108-4e8fc8af37f7', '_blank'); }}
                style={{
                  flex: 1, background: '#0B1220',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4V2"/><line x1="12" y1="10" x2="12" y2="22"/>
                  <line x1="6" y1="2" x2="6" y2="22"/>
                </svg>
                쿠팡이츠에서 사용하기
              </button>
            </div>
          </div>
        </div>

        {/* 찜한 콘텐츠 */}
        <div style={{ marginBottom: 24 }}>
          <button
            id="btn_profile_wishlist_title"
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, background: 'none', border: 'none', color: '#fff', padding: 0 }}
            onClick={() => trackClick('btn_profile_wishlist_title')}
          >
            <span style={{ fontSize: 15, fontWeight: 700 }}>찜한 콘텐츠 ›</span>
          </button>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {WISHLIST.map((item, idx) => (
              <button
                key={idx}
                id={`btn_profile_wishlist_${item.id}_${idx}`}
                onClick={() => showToast('준비 중입니다')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', flexShrink: 0 }}
              >
                <img
                  src={item.img}
                  alt=""
                  style={{ width: 90, height: 130, borderRadius: 8, objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 회원님이 좋아할 만한 콘텐츠 */}
        <div style={{ marginBottom: 24 }}>
          <button id="btn_profile_rec_title" onClick={() => trackClick('btn_profile_rec_title')} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, background: 'none', border: 'none', color: '#fff', padding: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>회원님이 좋아할 만한 콘텐츠 ›</span>
          </button>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {RECOMMEND.map((item, idx) => (
              <button
                key={item.id}
                id={`btn_profile_rec_${item.id}_${idx}`}
                onClick={() => { trackClick(`btn_profile_rec_${item.id}_${idx}`); navigate(`/detail/${item.id}`); }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', flexShrink: 0 }}
              >
                <img
                  src={item.img}
                  alt=""
                  style={{ width: 90, height: 130, borderRadius: 8, objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}