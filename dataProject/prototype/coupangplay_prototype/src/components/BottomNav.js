import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from './Toast';
import { trackClick } from '../utils/track';

const tabs = [
  { id: 'btn_gnb_home', label: '홈', path: '/' },
  { id: 'btn_gnb_resume', label: '이어보기', path: null },
  { id: 'btn_gnb_upcoming', label: '공개예정', path: null },
  { id: 'btn_gnb_search', label: '검색', path: null },
  { id: 'btn_gnb_profile', label: '프로필', path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleTab(tab) {
    trackClick(tab.id, { label: tab.label });
    if (tab.path) navigate(tab.path);
    else showToast('준비 중입니다');
  }

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', 
      maxWidth: 430,
      background: 'rgba(0,0,0,0.95)',
      borderTop: '1px solid #222',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(tab => {
        const active = tab.path && (location.pathname === tab.path || (tab.path === '/' && location.pathname === '/spang'));
        return (
          <button
            key={tab.id}
            id={tab.id}
            onClick={() => handleTab(tab)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, padding: '10px 0',
              color: active ? '#fff' : '#666', transition: 'color 0.2s',
            }}
          >
            {tab.id === 'btn_gnb_home' && <HomeIcon active={active} />}
            {tab.id === 'btn_gnb_resume' && <ResumeIcon active={active} />}
            {tab.id === 'btn_gnb_upcoming' && <UpcomingIcon active={active} />}
            {tab.id === 'btn_gnb_search' && <SearchIcon active={active} />}
            {tab.id === 'btn_gnb_profile' && <ProfileIcon active={active} />}
            <span style={{ fontSize: 10 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }) {
  const c = active ? '#fff' : '#666';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function ResumeIcon({ active }) {
  const c = active ? '#fff' : '#666';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8" fill={c} stroke="none"/>
    </svg>
  );
}

function UpcomingIcon({ active }) {
  const c = active ? '#fff' : '#666';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function SearchIcon({ active }) {
  const c = active ? '#fff' : '#666';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="profileGrad" x1="3.18186" y1="-4.77327" x2="35.0044" y2="41.8997" gradientUnits="userSpaceOnUse">
          <stop offset="0.418269" stopColor="#0086FF" stopOpacity="0.5"/>
          <stop offset="1" stopColor="white"/>
        </linearGradient>
      </defs>

      {/* 항상 보이는 원본 피그마 원 */}
      <path
        d="M15.9109 29.1707C23.2338 29.1707 29.1702 23.2343 29.1702 15.9114C29.1702 8.5884 23.2338 2.65198 15.9109 2.65198C8.58791 2.65198 2.65149 8.5884 2.65149 15.9114C2.65149 23.2343 8.58791 29.1707 15.9109 29.1707Z"
        fill="url(#profileGrad)"
      />

      {/* 클릭 후에만 추가되는 스트로크 링 + 파란 점 */}
      {active && (
        <>
          <circle cx="15.9109" cy="15.9114" r="14.5" fill="none" stroke="#FFFFFF" strokeWidth="1"/>
          <circle cx="26" cy="4" r="4" fill="#0086FF"/>
        </>
      )}
    </svg>
  );
}