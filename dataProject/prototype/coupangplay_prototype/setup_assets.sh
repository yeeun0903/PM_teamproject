#!/bin/bash
# 이 스크립트를 passplay 폴더 안에서 실행하세요
# 사용법: bash setup_assets.sh

mkdir -p public/assets

# 포스터
cp ../poster_smile.png public/assets/
cp ../poster_15focus.png public/assets/
cp ../poster_extra.png public/assets/
cp ../poster_drama.png public/assets/
cp ../poster_bakery.png public/assets/
cp ../poster_bookstore.png public/assets/
cp ../poster_love.png public/assets/
cp ../poster_nextlegend.png public/assets/
cp ../poster_romance.png public/assets/
cp ../poster_scientist.png public/assets/
cp ../poster_soccer.png public/assets/
cp ../poster_textbook.png public/assets/

# 상세 썸네일
cp ../detailthumbsmileclinic.png public/assets/
cp ../detailthumb15focus.png public/assets/
cp ../detailthumbextratime.png public/assets/
cp ../detailthumbdrama.png public/assets/

# 에피소드 썸네일
cp ../epsmileclinic01.png public/assets/
cp ../epsmileclinic02.png public/assets/
cp ../epsmileclinic03.png public/assets/
cp ../ep15focus01.png public/assets/
cp ../ep15focus02.png public/assets/
cp ../ep15focus03.png public/assets/
cp ../epextratime01.png public/assets/
cp ../epextratime02.png public/assets/
cp ../epextratime03.png public/assets/
cp ../epdrama01.png public/assets/
cp ../epdrama02.png public/assets/
cp ../epdrama03.png public/assets/

# 광고 배너
cp ../ad_banner_tumbler.png public/assets/
cp ../ad_banner_cake.png public/assets/
cp ../ad_banner_book.png public/assets/
cp ../ad_banner_powerade.png public/assets/
cp ../ad_banner_diet.png public/assets/
cp ../ad_banner_dumbell.png public/assets/
cp ../ad_banner_pants.png public/assets/
cp ../ad_banner_tteok.png public/assets/

# 메인 배너
cp ../banner_main_rolling_01.png public/assets/
cp ../banner_main_rolling_01_logo.png public/assets/
cp ../banner_main_rolling_02.png public/assets/
cp ../banner_main_rolling_02_logo.png public/assets/
cp ../banner_main_rolling_03.png public/assets/
cp ../banner_main_rolling_03_logo.png public/assets/
cp ../banner_main_rolling_04.png public/assets/
cp ../banner_main_rolling_04_logo.png public/assets/

# 로고 & 프로필
cp ../coupangplay_logo.png public/assets/
cp ../coupangplay.png public/assets/
cp ../img_profile.png public/assets/
cp ../img_Main_home.png public/assets/

# 영상 (같은 폴더에 있어야 함)
# cp ../video_smile.mp4 public/assets/
# cp ../video_15focus.mp4 public/assets/
# cp ../video_extra.mp4 public/assets/
# cp ../video_drama.mp4 public/assets/

echo "✅ 에셋 복사 완료!"
echo "👆 영상 파일은 직접 public/assets/ 폴더에 넣어주세요"
