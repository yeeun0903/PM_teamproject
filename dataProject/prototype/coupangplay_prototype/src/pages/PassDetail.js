import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Toast, { showToast } from '../components/Toast';
import { trackClick } from '../utils/track';

export default function PassDetail() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 80 }}>
      <Toast />

      {/* 상단 헤더 이미지 */}
      <div style={{ position: 'relative' }}>
        <img
          src="/assets/pass_son7.png"
          alt="Sports Pass"
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
        />
        {/* 뒤로가기 */}
        <button
          id="btn_pass_back"
          onClick={() => { trackClick('btn_pass_back'); navigate(-1); }}
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, fontSize: 26, color: '#fff', background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}
        >
          ←
        </button>
        {/* 닫기 */}
        <button
          id="btn_pass_close"
          onClick={() => { trackClick('btn_pass_close'); navigate('/'); }}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, fontSize: 20, color: '#fff', background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>

        {/* 하단 페이드아웃 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #000)', pointerEvents: 'none' }} />

        {/* SPORTS 타이틀 오버레이 */}
        <div style={{ position: 'absolute', top: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: 4, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>SPORTS</h1>
        </div>

      </div>

      {/* 구독 버튼 — 이미지 바로 아래 */}
      <div style={{ padding: '16px 20px' }}>
        <button
          id="btn_pass_subscribe"
          onClick={() => { trackClick('btn_pass_subscribe'); showToast('준비 중입니다'); }}
          style={{
            width: '100%', background: 'linear-gradient(150deg, #FF8C00 20%, #FFA500 80%)',
            color: '#fff', padding: '16px 0', borderRadius: 30,
            fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: 'pointer',
          }}
        >
          구독하러가기 ›
        </button>
      </div>

      {/* 설명 텍스트 */}
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: '#ddd', lineHeight: 1.8, marginBottom: 2 }}>
          EPL·NBA·F1까지,
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.8 }}>
          <span style={{ color: '#4FC3F7' }}>글로벌 스포츠</span>를 하나로 즐기는{' '}
          <span style={{ color: '#4FC3F7' }}>올인원 패스</span>
        </p>
      </div>

      {/* 스포츠 종목 탭 */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 15 }}>
        {['⚽ 축구', '🏀 농구', '🏎 모터스포츠', '🏈 기타 스포츠'].map((sport, si) => (
          <button
            key={sport}
            id={`btn_pass_sport_${si}`}
            onClick={() => { trackClick(`btn_pass_sport_${si}`, { sport }); showToast('준비 중입니다'); }}
            style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 20, border: '1px solid #444', fontSize: 13, color: '#fff', background: 'transparent' }}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* 특징 리스트 */}
      <div style={{ padding: '0 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {['다양한 스포츠 시청', '4K 초고화질 스트리밍', '멀티뷰, 타임머신 기능', '라이브 중계 + 다시보기'].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#ccc', fontSize: 14 }}>•</span>
            <span style={{ fontSize: 13, color: '#ccc' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* 패스 할인 혜택 — 원본 레이아웃: 가로 나열, 주황 테두리 */}
      <div style={{ margin: '0 16px 24px', border: '1px solid #444', borderRadius: 12, padding: '14px 16px', background: '#0a0a0a' }}>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', marginBottom: 14 }}>
          더 많은 <span style={{ color: '#4FC3F7' }}>콘텐츠</span>, 더 큰 <span style={{ color: '#FF8C00' }}>혜택</span>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {[
            { icon: '/assets/pass_ticket_icon.png',label: '원패스 선택 시', discount: '5% 할인' },
            { icon: '/assets/pass_playing_icon.png',label: '더블패스 선택 시', discount: '10% 할인' },
            { icon: '/assets/pass_gold_icon.png', label: '올패스 선택 시', discount: '30% 할인' },
          ].map((p, i) => (
            <React.Fragment key={p.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <img src={p.icon} style={{ width: 32, height: 32, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 8, color: '#aaa', marginBottom: 2, lineHeight: 1.4 }}>{p.label}</p>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{p.discount}</p>
                </div>
              </div>
              {i < 2 && <div style={{ width: 1, height: 36, background: '#333', flexShrink: 0, margin: '0 8px' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 인기 영상 — pass_player1/2.png 실제 이미지로 교체 */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ fontSize: 15, fontWeight: 700 }}>패스 구매시 볼 수 있는 인기 영상 ›</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            {
              img: '/assets/pass_player1.png',
              title: '맨체스터 시티 vs 아스널 HL',
              sub: '2026년 4월 20일 (월) · English Premier League 33라운드',
              duration: '11:49',
            },
            {
              img: '/assets/pass_player2.png',
              title: '레알 마드리드 vs 바르셀로나 HL',
              sub: '2026년 5월 1일 (목) · La Liga',
              duration: '10:25',
            },
          ].map((v, vi) => (
            <button
              key={v.title}
              id={`btn_pass_video_${vi}`}
              onClick={() => { trackClick(`btn_pass_video_${vi}`, { title: v.title }); showToast('스포츠 패스 구독 후 이용 가능합니다'); }}
              style={{ borderRadius: 8, overflow: 'hidden', background: '#111', textAlign: 'left', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {/* 썸네일 */}
              <div style={{ position: 'relative' }}>
                <img
                  src={v.img}
                  alt={v.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                />
                {/* 배지 */}
                <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', gap: 4 }}>
                  <span style={{ background: '#0075FF', fontSize: 9, padding: '2px 5px', borderRadius: 3, fontWeight: 700, color: '#fff' }}>패스</span>
                  <span style={{ background: 'rgba(0,0,0,0.6)', fontSize: 9, padding: '2px 5px', borderRadius: 3, color: '#fff' }}>하이라이트</span>
                </div>
                {/* 4K + 시간 */}
                <span style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', fontSize: 10, padding: '2px 5px', borderRadius: 3, color: '#fff', fontWeight: 700 }}>4K</span>
                <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', fontSize: 10, padding: '2px 5px', borderRadius: 3, color: '#fff' }}>{v.duration}</span>
              </div>
              {/* 텍스트 */}
              <div style={{ padding: '8px' }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, lineHeight: 1.4, color: '#fff' }}>{v.title}</p>
                <p style={{ fontSize: 10, color: '#777', lineHeight: 1.4 }}>{v.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}