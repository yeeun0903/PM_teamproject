import { showToast } from '../components/Toast';
import { trackClick } from '../utils/track';

/**
 * 컴포넌트 컨텍스트(navigate, state setters 등)를 받아 완전히 동작하는 버튼 목록을 반환합니다.
 * 정적 참조용으로는 BUTTONS를 사용하세요 (onClick은 no-op).
 */
export function createButtons(ctx = {}) {
  const {
    navigate = () => {},

    // spangHome
    bannerIdx = 0,
    setBannerIdx = () => {},
    MAIN_BANNERS = [],

    // settings
    setSelectedSub = () => {},
    setSelectedAudio = () => {},
    setSelectedQuality = () => {},

    // detail
    videoRef = { current: null },
    setIsPlaying = () => {},
    setWished = () => {},
    wished = false,
    setLiked = () => {},
    liked = false,
    setNotified = () => {},
    notified = false,
    setActiveTab = () => {},
    handleLike = () => {},
    handleDislike = () => {},
    togglePlay = () => {},
    toggleFullscreen = () => {},
    isFullscreen = false,
    isPlaying = false,
    setShowAdBanner = () => {},
    setCurrentEp = () => {},
    currentEp = 0,
    content = { banners: [{ url: '', img: '' }], banner: { url: '', img: '', text: '' }, episodes: [] },
    id = '',

    // player
    setIsLocked = () => {},
    setShowSubtitlePop = () => {},
    setShowSpeedPop = () => {},
    setShowRatioPop = () => {},
    setShowEpisodePop = () => {},
    closePopups = () => {},
    setSelectedSpeed = () => {},
  } = ctx;

  return {

    /* ────────────────────────────────────────
       MainHome.js
    ──────────────────────────────────────── */
    mainHome: [
      {
        id: 'btn_category',
        label: '카테고리',
        onClick: () => { trackClick('btn_category'); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_spang',
        label: '스팡',
        onClick: () => { trackClick('btn_top_spang', { label: '스팡' }); navigate('/spang'); },
      },
      {
        id: 'btn_top_tv',
        label: 'TV',
        onClick: () => { trackClick('btn_top_tv', { label: 'TV' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_movie',
        label: '영화',
        onClick: () => { trackClick('btn_top_movie', { label: '영화' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_sports',
        label: '스포츠',
        onClick: () => { trackClick('btn_top_sports', { label: '스포츠' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_live',
        label: '라이브',
        onClick: () => { trackClick('btn_top_live', { label: '라이브' }); showToast('준비 중입니다'); },
      },
      {
        id: 'main_poster_card',
        label: 'SNL Korea 포스터 카드',
        onClick: () => navigate('/detail/smile'),
      },
      {
        id: 'btn_main_play',
        label: '재생하기',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_main_play', { contentId: 'smile' }); navigate('/detail/smile'); },
      },
      {
        id: 'banner_bakery',
        label: '베이커리 배너',
        onClick: () => { trackClick('banner_bakery', { action: 'toast' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_event_dessert',
        label: '디저트 이벤트 배너',
        onClick: () => {
          trackClick('btn_event_dessert', { action: 'link' });
          window.open('https://link.coupang.com/re/OMSPAGESHARE?pageKey=169503&sourceType2=oms_share&title=%EB%A1%9C%EC%BC%93%ED%94%84%EB%A0%88%EC%8B%9C%20%EB%B4%89%EC%A3%BC%EB%A5%B4%EB%B9%B5%EC%A7%91&destUrl=https%3A%2F%2Fpages.coupang.com%2Fm%2F169503%3FsourceType%3Doms_share%26title%3D%25EB%25A1%259C%25EC%25BC%2593%25ED%2594%2584%25EB%25A0%2588%25EC%258B%259C%2520%25EB%25B4%2589%25EC%25A3%25BC%25EB%25A5%25B4%25EB%25B9%25B5%25EC%25A7%2591', '_blank');
        },
      },
      {
        id: 'banner_tteok',
        label: '오뚜기 떡볶이 배너',
        onClick: () => {
          trackClick('banner_tteok', { action: 'link' });
          window.open('https://link.coupang.com/re/SHOPPAGESHARE?pageKey=294249&urlName=ottogi&sourceType2=brandstore_display_ads&lptag=A00054860&title=%EA%B0%80%EB%BF%90%ED%95%9C%EB%81%BC&destUrl=https%3A%2F%2Fshop.coupang.com%2Fottogi%2F294249%3Fsource%3Dbrandstore_display_ads%26platform%3Dm', '_blank');
        },
      },
      {
        id: 'btn_event_predict',
        label: '스포츠 패스 이벤트 배너',
        onClick: () => { trackClick('btn_event_predict', { action: 'page' }); navigate('/pass-detail'); },
      },
    ],

    /* ────────────────────────────────────────
       SpangHome.js
    ──────────────────────────────────────── */
    spangHome: [
      {
        id: 'btn_category',
        label: '카테고리',
        onClick: () => { trackClick('btn_category'); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_spang',
        label: '스팡',
        onClick: () => { trackClick('btn_top_spang', { label: '스팡' }); },
      },
      {
        id: 'btn_top_tv',
        label: 'TV',
        onClick: () => { trackClick('btn_top_tv', { label: 'TV' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_movie',
        label: '영화',
        onClick: () => { trackClick('btn_top_movie', { label: '영화' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_sports',
        label: '스포츠',
        onClick: () => { trackClick('btn_top_sports', { label: '스포츠' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_top_live',
        label: '라이브',
        onClick: () => { trackClick('btn_top_live', { label: '라이브' }); showToast('준비 중입니다'); },
      },
      {
        id: 'banner_main',
        label: '메인 배너 슬라이더',
        onClick: () => navigate(`/detail/${MAIN_BANNERS[bannerIdx]?.contentId}`),
      },
      {
        id: 'btn_main_play',
        label: '재생하기',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_main_play', { contentId: MAIN_BANNERS[bannerIdx]?.contentId }); navigate(`/detail/${MAIN_BANNERS[bannerIdx]?.contentId}`); },
      },
      {
        id: 'btn_banner_dot_0',
        label: '배너 dot 1',
        onClick: () => { trackClick('btn_banner_dot_0', { index: 0 }); setBannerIdx(0); },
      },
      {
        id: 'btn_banner_dot_1',
        label: '배너 dot 2',
        onClick: () => { trackClick('btn_banner_dot_1', { index: 1 }); setBannerIdx(1); },
      },
      {
        id: 'btn_banner_dot_2',
        label: '배너 dot 3',
        onClick: () => { trackClick('btn_banner_dot_2', { index: 2 }); setBannerIdx(2); },
      },
      {
        id: 'btn_banner_dot_3',
        label: '배너 dot 4',
        onClick: () => { trackClick('btn_banner_dot_3', { index: 3 }); setBannerIdx(3); },
      },
      // 동적 생성 — item.contentId, idx 기반
      {
        id: 'btn_cat_${contentId}_${idx}',
        label: '카테고리 콘텐츠 카드',
        note: '동적 생성. onClick: (item, idx, cat) => () => navigate(`/detail/${item.contentId}`)',
        onClick: (item, _idx, cat) => () => { trackClick(`btn_cat_${item.contentId}`, { contentId: item.contentId, category: cat.label }); navigate(`/detail/${item.contentId}`); },
      },
      // 동적 생성 — c.id, rank 기반
      {
        id: 'btn_top10_${id}',
        label: 'TOP 10 콘텐츠 카드',
        note: '동적 생성. onClick: (c, i) => () => navigate(`/detail/${c.id}`)',
        onClick: (c, i) => () => { trackClick(`btn_top10_${c.id}`, { contentId: c.id, rank: i + 1 }); navigate(`/detail/${c.id}`); },
      },
    ],

    /* ────────────────────────────────────────
       PassDetail.js
    ──────────────────────────────────────── */
    passDetail: [
      {
        id: 'btn_passdetail_back',
        label: '뒤로가기',
        onClick: () => { trackClick('btn_passdetail_back'); navigate(-1); },
      },
      {
        id: 'btn_passdetail_close',
        label: '닫기',
        onClick: () => { trackClick('btn_passdetail_close'); navigate('/'); },
      },
      {
        id: 'btn_passdetail_subscribe',
        label: '구독하러가기',
        onClick: () => { trackClick('btn_passdetail_subscribe'); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_sport_⚽ 축구',
        label: '⚽ 축구 탭',
        onClick: () => { trackClick('btn_sport_⚽ 축구', { sport: '⚽ 축구' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_sport_🏀 농구',
        label: '🏀 농구 탭',
        onClick: () => { trackClick('btn_sport_🏀 농구', { sport: '🏀 농구' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_sport_🏎 모터스포츠',
        label: '🏎 모터스포츠 탭',
        onClick: () => { trackClick('btn_sport_🏎 모터스포츠', { sport: '🏎 모터스포츠' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_sport_🏈 기타 스포츠',
        label: '🏈 기타 스포츠 탭',
        onClick: () => { trackClick('btn_sport_🏈 기타 스포츠', { sport: '🏈 기타 스포츠' }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_pass_video_맨체스터 시티 vs 아스널 HL',
        label: '맨체스터 시티 vs 아스널 HL 영상',
        onClick: () => { trackClick('btn_pass_video', { title: '맨체스터 시티 vs 아스널 HL' }); showToast('스포츠 패스 구독 후 이용 가능합니다'); },
      },
      {
        id: 'btn_pass_video_레알 마드리드 vs 바르셀로나 HL',
        label: '레알 마드리드 vs 바르셀로나 HL 영상',
        onClick: () => { trackClick('btn_pass_video', { title: '레알 마드리드 vs 바르셀로나 HL' }); showToast('스포츠 패스 구독 후 이용 가능합니다'); },
      },
    ],

    /* ────────────────────────────────────────
       Profile.js
    ──────────────────────────────────────── */
    profile: [
      {
        id: 'btn_profile_settings',
        label: '설정',
        onClick: () => { trackClick('btn_profile_settings'); navigate('/settings'); },
      },
      {
        id: 'btn_mypage_coupon_use',
        label: '쿠팡에서 사용하기',
        onClick: () => { trackClick('btn_mypage_coupon_use'); window.open('https://www.coupang.com', '_blank'); },
      },
      {
        id: 'btn_mypage_eats_use',
        label: '쿠팡이츠에서 사용하기',
        onClick: () => { trackClick('btn_mypage_eats_use'); window.open('https://web.coupangeats.com/share?storeId=756683&dishId=107238778&key=4e00e7af-4bf7-4e17-8108-4e8fc8af37f7', '_blank'); },
      },
      {
        id: 'btn_mypage_wishlist',
        label: '찜한 콘텐츠 더보기',
        onClick: () => trackClick('btn_mypage_wishlist'),
      },
      {
        id: 'btn_wishlist_focus',
        label: '찜 - 15분',
        onClick: () => { trackClick('btn_wishlist_focus'); navigate('/detail/focus'); },
      },
      {
        id: 'btn_wishlist_drama',
        label: '찜 - 드라마',
        onClick: () => { trackClick('btn_wishlist_drama'); navigate('/detail/drama'); },
      },
      {
        id: 'btn_wishlist_smile',
        label: '찜 - SNL',
        onClick: () => { trackClick('btn_wishlist_smile'); navigate('/detail/smile'); },
      },
      {
        id: 'btn_wishlist_extra',
        label: '찜 - 엑스트라',
        onClick: () => { trackClick('btn_wishlist_extra'); navigate('/detail/extra'); },
      },
      {
        id: 'btn_mypage_recommend',
        label: '추천 콘텐츠 더보기',
        onClick: () => trackClick('btn_mypage_recommend'),
      },
      {
        id: 'btn_recommend_smile',
        label: '추천 - SNL',
        onClick: () => { trackClick('btn_recommend_smile'); navigate('/detail/smile'); },
      },
      {
        id: 'btn_recommend_null',
        label: '추천 - 준비 중 (romance)',
        onClick: () => { trackClick('btn_recommend_null'); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_recommend_extra',
        label: '추천 - 엑스트라',
        onClick: () => { trackClick('btn_recommend_extra'); navigate('/detail/extra'); },
      },
      {
        id: 'btn_recommend_null_love',
        label: '추천 - 준비 중 (love)',
        onClick: () => { trackClick('btn_recommend_null'); showToast('준비 중입니다'); },
      },
    ],

    /* ────────────────────────────────────────
       Settings.js
    ──────────────────────────────────────── */
    settings: [
      {
        id: 'btn_settings_close',
        label: '닫기',
        onClick: () => { trackClick('btn_settings_close'); navigate(-1); },
      },
      {
        id: 'btn_setting_sub_자막없음',
        label: '자막없음',
        onClick: () => { trackClick('btn_setting_sub_자막없음', { subtitle: '자막없음' }); setSelectedSub('자막없음'); showToast('자막 언어: 자막없음'); },
      },
      {
        id: 'btn_setting_sub_한국어 (SDH)',
        label: '한국어 (SDH) 자막',
        onClick: () => { trackClick('btn_setting_sub_한국어 (SDH)', { subtitle: '한국어 (SDH)' }); setSelectedSub('한국어 (SDH)'); showToast('자막 언어: 한국어 (SDH)'); },
      },
      {
        id: 'btn_setting_sub_영어',
        label: '영어 자막',
        onClick: () => { trackClick('btn_setting_sub_영어', { subtitle: '영어' }); setSelectedSub('영어'); showToast('자막 언어: 영어'); },
      },
      {
        id: 'btn_setting_sub_중국어',
        label: '중국어 자막',
        onClick: () => { trackClick('btn_setting_sub_중국어', { subtitle: '중국어' }); setSelectedSub('중국어'); showToast('자막 언어: 중국어'); },
      },
      {
        id: 'btn_setting_audio_한국어',
        label: '한국어 음성',
        onClick: () => { trackClick('btn_setting_audio_한국어', { lang: '한국어' }); setSelectedAudio('한국어'); showToast('음성 언어: 한국어'); },
      },
      {
        id: 'btn_setting_audio_영어',
        label: '영어 음성',
        onClick: () => { trackClick('btn_setting_audio_영어', { lang: '영어' }); setSelectedAudio('영어'); showToast('음성 언어: 영어'); },
      },
      {
        id: 'btn_setting_quality_자동 (1080)',
        label: '자동 (1080) 화질',
        onClick: () => { trackClick('btn_setting_quality_자동 (1080)', { quality: '자동 (1080)' }); setSelectedQuality('자동 (1080)'); showToast('화질: 자동 (1080)'); },
      },
      {
        id: 'btn_setting_quality_HD (720)',
        label: 'HD (720) 화질',
        onClick: () => { trackClick('btn_setting_quality_HD (720)', { quality: 'HD (720)' }); setSelectedQuality('HD (720)'); showToast('화질: HD (720)'); },
      },
      {
        id: 'btn_setting_quality_SD (480)',
        label: 'SD (480) 화질',
        onClick: () => { trackClick('btn_setting_quality_SD (480)', { quality: 'SD (480)' }); setSelectedQuality('SD (480)'); showToast('화질: SD (480)'); },
      },
    ],

    /* ────────────────────────────────────────
       Detail.js
    ──────────────────────────────────────── */
    detail: [
      // 플레이어 헤더
      {
        id: 'btn_detail_back',
        label: '뒤로가기',
        onClick: () => { trackClick('btn_detail_back'); if (document.fullscreenElement) document.exitFullscreen?.(); navigate(-1); },
      },
      {
        id: 'btn_detail_fullscreen',
        label: '전체화면',
        onClick: () => { trackClick('btn_detail_fullscreen', { isFullscreen }); toggleFullscreen(); },
      },
      {
        id: 'btn_detail_more',
        label: '더보기',
        onClick: () => { trackClick('btn_detail_more'); showToast('준비 중'); },
      },
      // 플레이어 중앙 컨트롤
      {
        id: 'btn_player_rewind',
        label: '10초 뒤로',
        onClick: () => { trackClick('btn_player_rewind'); if (videoRef.current) videoRef.current.currentTime -= 10; },
      },
      {
        id: 'btn_player_play',
        label: '재생/일시정지',
        onClick: () => { trackClick('btn_player_play', { isPlaying }); togglePlay(); },
      },
      {
        id: 'btn_player_forward',
        label: '10초 앞으로',
        onClick: () => { trackClick('btn_player_forward'); if (videoRef.current) videoRef.current.currentTime += 10; },
      },
      // 플레이어 하단 버튼
      {
        id: 'btn_player_recommend',
        label: '추천 콘텐츠',
        onClick: () => { trackClick('btn_player_recommend'); showToast('추천 콘텐츠'); },
      },
      {
        id: 'btn_player_prev_ep',
        label: '이전화',
        onClick: () => {
          trackClick('btn_player_prev_ep', { currentEp });
          if (currentEp > 0) {
            setCurrentEp(currentEp - 1);
            if (videoRef.current) videoRef.current.currentTime = 0;
            showToast(`${currentEp}화로 이동`);
          } else {
            showToast('첫 번째 화입니다');
          }
        },
      },
      {
        id: 'btn_player_episode_list',
        label: '에피소드 목록',
        onClick: () => { trackClick('btn_player_episode_list'); if (document.fullscreenElement) document.exitFullscreen?.(); setActiveTab('btn_detail_tab_episode'); window.scrollTo({ top: 400, behavior: 'smooth' }); },
      },
      {
        id: 'btn_player_next_ep',
        label: '다음화',
        onClick: () => {
          trackClick('btn_player_next_ep', { currentEp });
          if (currentEp < content.episodes.length - 1) {
            setCurrentEp(currentEp + 1);
            if (videoRef.current) videoRef.current.currentTime = 0;
            showToast(`${currentEp + 2}화로 이동`);
          } else {
            showToast('마지막 화입니다');
          }
        },
      },
      // 광고 배너
      {
        id: 'btn_ad_close',
        label: '광고 닫기',
        onClick: () => { trackClick('btn_ad_close'); setShowAdBanner(false); },
      },
      {
        id: 'btn_ad_banner',
        label: '광고 배너',
        onClick: () => { trackClick('btn_ad_banner', { url: content.banners[0].url }); window.open(content.banners[0].url, '_blank'); },
      },
      // 콘텐츠 정보
      {
        id: `btn_play_${id}`,
        label: '1화 이어보기',
        onClick: () => {
          trackClick(`btn_play_${id}`, { contentId: id });
          if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
      },
      {
        id: 'btn_detail_wish',
        label: '찜하기',
        onClick: () => { trackClick('btn_detail_wish', { wished: !wished }); setWished(!wished); showToast(wished ? '찜하기 해제됨' : '찜하기 등록됨'); },
      },
      {
        id: 'btn_detail_like',
        label: '좋아요',
        onClick: () => { trackClick('btn_detail_like', { liked: !liked }); setLiked(!liked); showToast(liked ? '좋아요 해제됨' : '좋아요!'); },
      },
      {
        id: 'btn_detail_notif',
        label: '알림받기',
        onClick: () => { trackClick('btn_detail_notif', { notified: !notified }); setNotified(!notified); showToast(notified ? '알림 해제됨' : '알림 설정됨'); },
      },
      {
        id: 'btn_detail_share',
        label: '공유하기',
        onClick: () => { trackClick('btn_detail_share'); showToast('공유 링크가 복사됐습니다'); },
      },
      // 탭
      {
        id: 'btn_detail_tab_episode',
        label: '에피소드 탭',
        onClick: () => { trackClick('btn_detail_tab_episode', { label: '에피소드' }); setActiveTab('btn_detail_tab_episode'); },
      },
      {
        id: 'btn_detail_tab_review',
        label: '리뷰 탭',
        onClick: () => { trackClick('btn_detail_tab_review', { label: '리뷰' }); setActiveTab('btn_detail_tab_review'); },
      },
      {
        id: 'btn_detail_tab_recommend',
        label: '추천콘텐츠 탭',
        onClick: () => { trackClick('btn_detail_tab_recommend', { label: '추천콘텐츠' }); setActiveTab('btn_detail_tab_recommend'); },
      },
      {
        id: 'btn_detail_tab_info',
        label: '상세정보 탭',
        onClick: () => { trackClick('btn_detail_tab_info', { label: '상세정보' }); setActiveTab('btn_detail_tab_info'); },
      },
      // 에피소드 탭 필터/검색
      {
        id: 'btn_ep_filter_전체 회차',
        label: '전체 회차 필터',
        onClick: () => trackClick('btn_ep_filter_전체 회차', { label: '전체 회차' }),
      },
      {
        id: 'btn_ep_filter_최신 순',
        label: '최신 순 필터',
        onClick: () => trackClick('btn_ep_filter_최신 순', { label: '최신 순' }),
      },
      {
        id: 'btn_ep_search',
        label: '에피소드 검색',
        onClick: () => trackClick('btn_ep_search'),
      },
      // 동적 생성 — ep.num 기반
      {
        id: 'btn_ep_${ep.num}',
        label: '에피소드 카드',
        note: '동적 생성. onClick: (ep) => () => { videoRef.current.play(); setIsPlaying(true); window.scrollTo({top:0}) }',
        onClick: (ep) => () => {
          trackClick(`btn_ep_${ep.num}`, { epNum: ep.num, epTitle: ep.title });
          if (videoRef.current) { videoRef.current.play(); setIsPlaying(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        },
      },
      {
        id: 'btn_ep_download_${ep.num}',
        label: '에피소드 다운로드',
        note: '동적 생성. onClick: (ep) => (e) => { e.stopPropagation(); showToast("다운로드 준비 중입니다") }',
        onClick: (ep) => (e) => { e.stopPropagation(); trackClick(`btn_ep_download_${ep.num}`, { epNum: ep.num }); showToast('다운로드 준비 중입니다'); },
      },
      // 리뷰 탭 — 동적 생성
      {
        id: 'btn_review_like_${i}',
        label: '리뷰 좋아요',
        note: '동적 생성. onClick: (i) => () => handleLike(i)',
        onClick: (i) => () => { trackClick(`btn_review_like_${i}`, { index: i }); handleLike(i); },
      },
      {
        id: 'btn_review_dislike_${i}',
        label: '리뷰 싫어요',
        note: '동적 생성. onClick: (i) => () => handleDislike(i)',
        onClick: (i) => () => { trackClick(`btn_review_dislike_${i}`, { index: i }); handleDislike(i); },
      },
      // 추천콘텐츠 탭
      {
        id: 'btn_rec_drama',
        label: '추천 - 드라마',
        onClick: () => { trackClick('btn_rec_drama', { contentId: 'drama' }); navigate('/detail/drama'); },
      },
      {
        id: 'btn_rec_1',
        label: '추천 - 준비 중 (bookstore)',
        onClick: () => { trackClick('btn_rec_1', { contentId: null }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_rec_focus',
        label: '추천 - 15분',
        onClick: () => { trackClick('btn_rec_focus', { contentId: 'focus' }); navigate('/detail/focus'); },
      },
      {
        id: 'btn_rec_sports_extra',
        label: '스포츠 추천 - 엑스트라',
        onClick: () => { trackClick('btn_rec_sports_extra', { contentId: 'extra' }); navigate('/detail/extra'); },
      },
      {
        id: 'btn_rec_sports_1',
        label: '스포츠 추천 - 준비 중 (nextlegend)',
        onClick: () => { trackClick('btn_rec_sports_1', { contentId: null }); showToast('준비 중입니다'); },
      },
      {
        id: 'btn_rec_sports_2',
        label: '스포츠 추천 - 준비 중 (soccer)',
        onClick: () => { trackClick('btn_rec_sports_2', { contentId: null }); showToast('준비 중입니다'); },
      },
    ],

    /* ────────────────────────────────────────
       Player.js
    ──────────────────────────────────────── */
    player: [
      // 잠금 화면
      {
        id: 'btn_player_unlock',
        label: '잠금 해제',
        onClick: () => { trackClick('btn_player_unlock'); setIsLocked(false); showToast('화면 잠금 해제됨'); },
      },
      // 헤더
      {
        id: 'btn_player_close',
        label: '닫기',
        onClick: () => { trackClick('btn_player_close'); document.exitFullscreen?.(); navigate(-1); },
      },
      {
        id: 'btn_player_subtitle',
        label: '자막',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_player_subtitle'); closePopups(); setShowSubtitlePop(true); },
      },
      {
        id: 'btn_player_speed',
        label: '속도',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_player_speed'); closePopups(); setShowSpeedPop(true); },
      },
      {
        id: 'btn_player_aspect_ratio',
        label: '비율',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_player_aspect_ratio'); closePopups(); setShowRatioPop(true); },
      },
      {
        id: 'btn_player_lock',
        label: '잠금',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_player_lock'); setIsLocked(true); showToast('화면이 잠겼습니다'); },
      },
      // 중앙 재생
      {
        id: 'btn_player_play',
        label: '재생/일시정지',
        onClick: () => { trackClick('btn_player_play', { isPlaying }); togglePlay(); },
      },
      // 하단 컨트롤
      {
        id: 'btn_player_prev_episode',
        label: '이전 에피소드',
        onClick: () => { trackClick('btn_player_prev_episode'); showToast('이전 화로 이동합니다'); },
      },
      {
        id: 'btn_player_episode_list',
        label: '에피소드 목록',
        onClick: (e) => { e?.stopPropagation(); trackClick('btn_player_episode_list'); closePopups(); setShowEpisodePop(true); },
      },
      {
        id: 'btn_player_next_episode',
        label: '다음 에피소드',
        onClick: () => { trackClick('btn_player_next_episode'); showToast('다음 화로 이동합니다'); },
      },
      {
        id: 'btn_player_fullscreen',
        label: '전체화면',
        onClick: () => { trackClick('btn_player_fullscreen', { isFullscreen }); toggleFullscreen(); },
      },
      // 광고 배너
      {
        id: 'btn_ad_banner',
        label: '광고 배너',
        onClick: () => { trackClick('btn_ad_banner', { url: content.banner.url }); window.open(content.banner.url, '_blank'); },
      },
      {
        id: 'btn_ad_close',
        label: '광고 닫기',
        onClick: () => { trackClick('btn_ad_close'); setShowAdBanner(false); },
      },
      // 자막 팝업
      { id: 'btn_sub_자막없음',      label: '자막없음',      onClick: () => { trackClick('btn_sub_자막없음',      { subtitle: '자막없음' });      setSelectedSub('자막없음');      closePopups(); showToast('자막: 자막없음'); } },
      { id: 'btn_sub_한국어 (SDH)',  label: '한국어 (SDH)', onClick: () => { trackClick('btn_sub_한국어 (SDH)', { subtitle: '한국어 (SDH)' }); setSelectedSub('한국어 (SDH)'); closePopups(); showToast('자막: 한국어 (SDH)'); } },
      { id: 'btn_sub_영어',          label: '영어 자막',    onClick: () => { trackClick('btn_sub_영어',          { subtitle: '영어' });          setSelectedSub('영어');          closePopups(); showToast('자막: 영어'); } },
      { id: 'btn_sub_중국어',        label: '중국어 자막',  onClick: () => { trackClick('btn_sub_중국어',        { subtitle: '중국어' });        setSelectedSub('중국어');        closePopups(); showToast('자막: 중국어'); } },
      // 음성 언어 팝업
      { id: 'btn_lang_한국어', label: '한국어 음성', onClick: () => trackClick('btn_lang_한국어', { lang: '한국어' }) },
      { id: 'btn_lang_영어',   label: '영어 음성',   onClick: () => trackClick('btn_lang_영어',   { lang: '영어' }) },
      // 속도 팝업
      { id: 'btn_speed_0.5x',  label: '0.5x',  onClick: () => { trackClick('btn_speed_0.5x',  { speed: '0.5x' });  setSelectedSpeed('0.5x');  closePopups(); showToast('재생 속도: 0.5x'); } },
      { id: 'btn_speed_0.75x', label: '0.75x', onClick: () => { trackClick('btn_speed_0.75x', { speed: '0.75x' }); setSelectedSpeed('0.75x'); closePopups(); showToast('재생 속도: 0.75x'); } },
      { id: 'btn_speed_1.0x',  label: '1.0x',  onClick: () => { trackClick('btn_speed_1.0x',  { speed: '1.0x' });  setSelectedSpeed('1.0x');  closePopups(); showToast('재생 속도: 1.0x'); } },
      { id: 'btn_speed_1.25x', label: '1.25x', onClick: () => { trackClick('btn_speed_1.25x', { speed: '1.25x' }); setSelectedSpeed('1.25x'); closePopups(); showToast('재생 속도: 1.25x'); } },
      { id: 'btn_speed_1.5x',  label: '1.5x',  onClick: () => { trackClick('btn_speed_1.5x',  { speed: '1.5x' });  setSelectedSpeed('1.5x');  closePopups(); showToast('재생 속도: 1.5x'); } },
      { id: 'btn_speed_2.0x',  label: '2.0x',  onClick: () => { trackClick('btn_speed_2.0x',  { speed: '2.0x' });  setSelectedSpeed('2.0x');  closePopups(); showToast('재생 속도: 2.0x'); } },
      // 화면 비율 팝업
      { id: 'btn_ratio_화면에 맞추기', label: '화면에 맞추기', onClick: () => { trackClick('btn_ratio_화면에 맞추기', { ratio: '화면에 맞추기' }); closePopups(); showToast('화면 비율: 화면에 맞추기'); } },
      { id: 'btn_ratio_원본 비율',     label: '원본 비율',     onClick: () => { trackClick('btn_ratio_원본 비율',     { ratio: '원본 비율' });     closePopups(); showToast('화면 비율: 원본 비율'); } },
      { id: 'btn_ratio_꽉 채우기',     label: '꽉 채우기',     onClick: () => { trackClick('btn_ratio_꽉 채우기',     { ratio: '꽉 채우기' });     closePopups(); showToast('화면 비율: 꽉 채우기'); } },
      // 팝업 공통
      {
        id: 'btn_popup_close',
        label: '팝업 닫기',
        onClick: () => { trackClick('btn_popup_close'); closePopups(); },
      },
      // 에피소드 팝업 — 동적 생성
      {
        id: 'btn_ep_popup_${ep.num}',
        label: '에피소드 팝업 항목',
        note: '동적 생성. onClick: (ep) => () => { closePopups(); showToast(`${ep.num}화 재생 중...`) }',
        onClick: (ep) => () => { trackClick(`btn_ep_popup_${ep.num}`, { epNum: ep.num }); closePopups(); showToast(`${ep.num}화 재생 중...`); },
      },
      // 다음 에피소드 카드 — 동적 생성
      {
        id: 'btn_next_ep_${ep.num}',
        label: '다음 에피소드 카드',
        note: '동적 생성. onClick: (ep) => () => showToast("재생 중...")',
        onClick: (ep) => () => { trackClick(`btn_next_ep_${ep.num}`, { epNum: ep.num, epTitle: ep.title }); showToast('재생 중...'); },
      },
    ],
  };
}

// 정적 참조용 (onClick은 no-op — 실제 동작이 필요하면 createButtons(ctx)를 사용하세요)
export const BUTTONS = createButtons();
