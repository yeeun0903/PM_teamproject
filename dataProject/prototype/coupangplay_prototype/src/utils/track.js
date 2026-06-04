/**
 * trackClick — 버튼 클릭 이벤트 로거
 *
 * 사용법:
 *   trackClick('btn_id')
 *   trackClick('btn_id', { label: '재생하기', contentId: 'smile' })
 *
 * 기록 위치:
 *   - 브라우저 콘솔 (개발 확인용)
 *   - localStorage['clickLog'] (세션 간 누적 보존)
 *   - window.__trackLog (런타임 메모리 접근용)
 */
export function trackClick(id, extra = {}) {
  const event = {
    id,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    ...extra,
  };

  // 콘솔 출력
  console.log('[TRACK]', event);

  // 런타임 메모리
  if (!window.__trackLog) window.__trackLog = [];
  window.__trackLog.push(event);

  // localStorage 영속 저장
  try {
    const stored = JSON.parse(localStorage.getItem('clickLog') || '[]');
    stored.push(event);
    localStorage.setItem('clickLog', JSON.stringify(stored));
  } catch (_) {}
}

/**
 * getClickLog — 누적된 클릭 로그 반환
 * 브라우저 콘솔에서 바로 호출 가능:
 *   import { getClickLog } from './utils/track'; getClickLog();
 */
export function getClickLog() {
  try {
    return JSON.parse(localStorage.getItem('clickLog') || '[]');
  } catch (_) {
    return [];
  }
}

/**
 * clearClickLog — 로그 초기화
 */
export function clearClickLog() {
  localStorage.removeItem('clickLog');
  window.__trackLog = [];
}
