import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { showToast } from '../components/Toast';
import { trackClick } from '../utils/track';

// 토글 스위치 컴포넌트
function Toggle({ isOn, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        position: 'relative',
        width: 44,
        height: 26,
        background: isOn ? '#0077FF' : '#3A3A3C',
        borderRadius: 26,
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 22,
          height: 22,
          top: 2,
          left: isOn ? 20 : 2,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [selectedSub, setSelectedSub] = useState('자막없음');
  const [selectedAudio, setSelectedAudio] = useState('한국어');
  const [selectedQuality, setSelectedQuality] = useState('자동 (1080)');

  const SUBTITLES = ['자막없음', '한국어 (SDH)', '영어', '중국어'];
  const AUDIO_LANGS = ['한국어', '영어'];
  const QUALITIES = ['자동 (1080)', 'HD (720)', 'SD (480)'];

  const rowStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid #1a1a1a',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #1a1a1a',
    cursor: 'pointer',
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <Toast />

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px' }}>
        <button
          id="btn_settings_close"
          onClick={() => { trackClick('btn_settings_close'); navigate(-1); }}
          style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          ✕
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>설정</h1>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* 자막 섹션 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#fff' }}>자막</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>재생 시 기본으로 사용할 자막 언어를 선택하세요</p>
          {SUBTITLES.map(sub => (
            <div
              key={sub}
              onClick={() => {
                trackClick(`btn_setting_sub_${sub}`, { subtitle: sub });
                setSelectedSub(sub);
                showToast(`자막 언어: ${sub}`);
              }}
              style={rowStyle}
            >
              <span style={{ fontSize: 15, color: selectedSub === sub ? '#fff' : '#aaa' }}>{sub}</span>
              <Toggle isOn={selectedSub === sub} onToggle={() => {}} />
            </div>
          ))}
        </div>

        {/* 음성 언어 섹션 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#fff' }}>음성 언어</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>재생 시 기본으로 사용할 음성 언어를 선택하세요</p>
          {AUDIO_LANGS.map(lang => (
            <div
              key={lang}
              onClick={() => {
                trackClick(`btn_setting_audio_${lang}`, { lang });
                setSelectedAudio(lang);
                showToast(`음성 언어: ${lang}`);
              }}
              style={rowStyle}
            >
              <span style={{ fontSize: 15, color: selectedAudio === lang ? '#fff' : '#aaa' }}>{lang}</span>
              <Toggle isOn={selectedAudio === lang} onToggle={() => {}} />
            </div>
          ))}
        </div>

        {/* 해상도 섹션 */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#fff' }}>해상도</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>스트리밍 화질을 선택하세요</p>
          {QUALITIES.map(q => (
            <div
              key={q}
              onClick={() => {
                trackClick(`btn_setting_quality_${q}`, { quality: q });
                setSelectedQuality(q);
                showToast(`화질: ${q}`);
              }}
              style={rowStyle}
            >
              <span style={{ fontSize: 15, color: selectedQuality === q ? '#fff' : '#aaa' }}>{q}</span>
              <Toggle isOn={selectedQuality === q} onToggle={() => {}} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}