#!/usr/bin/env python
# coding: utf-8

# # 드라마 장르별 롱폼 영상 통계 수집
# YouTube Data API v3로 장르·키워드별 롱폼(10분 이상) 영상 데이터를 수집해 MySQL에 저장합니다.

# ## 0. 환경 설정

# In[1]:


import os
import re
import pandas as pd
from dotenv import load_dotenv
from googleapiclient.discovery import build
from sqlalchemy import create_engine, text
import pymysql

load_dotenv()

api_key    = os.getenv('YOUTUBE_API_KEY')
mysql_host = os.getenv('MYSQL_HOST', 'localhost')
mysql_user = os.getenv('MYSQL_USER', 'root')
mysql_pw   = os.getenv('MYSQL_PASSWORD', '')
mysql_db   = os.getenv('MYSQL_DB', 'youtube_data')

assert api_key, '.env에 YOUTUBE_API_KEY가 없습니다.'

print(f'API KEY : {api_key[:8]}...')
print(f'MySQL   : {mysql_user}@{mysql_host}/{mysql_db}')


# ## 1. YouTube API 클라이언트 초기화

# In[2]:


def init_youtube_client(api_key: str):
    """YouTube Data API v3 클라이언트를 생성한다."""
    try:
        youtube_client = build('youtube', 'v3', developerKey=api_key)
        print('YouTube 클라이언트 초기화 완료')
        return youtube_client
    except Exception as e:
        print(f'[ERROR] 클라이언트 초기화 실패: {e}')
        raise


youtube_client = init_youtube_client(api_key)


# ## 2. MySQL 연결

# In[3]:


def init_db_engine(host: str, user: str, pw: str, db: str):
    """MySQL DB가 없으면 생성하고 SQLAlchemy 엔진을 반환한다."""
    try:
        # DB 없으면 먼저 생성
        conn = pymysql.connect(host=host, user=user, password=pw, charset='utf8mb4')
        with conn.cursor() as cur:
            cur.execute(
                f'CREATE DATABASE IF NOT EXISTS `{db}` '
                f'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
            )
        conn.close()

        url    = f'mysql+pymysql://{user}:{pw}@{host}/{db}?charset=utf8mb4'
        engine = create_engine(url)

        with engine.connect() as c:
            c.execute(text('SELECT 1'))

        print(f'MySQL 연결 성공: {user}@{host}/{db}')
        return engine
    except Exception as e:
        print(f'[ERROR] MySQL 연결 실패: {e}')
        raise


engine = init_db_engine(mysql_host, mysql_user, mysql_pw, mysql_db)


# ## 3. 검색 키워드 정의

# In[4]:


# 장르별 검색 키워드 매핑
GENRE_KEYWORDS = {
    '로맨스':   ['눈물의 여왕', '킹더랜드'],
    '재벌':     ['재벌집 막내아들', '상속자들'],
    '불륜복수': ['부부의 세계', '펜트하우스'],
}

LONGFORM_MIN_SECONDS = 600   # 롱폼 기준: 10분 이상
SEARCH_MAX_RESULTS   = 50    # 키워드당 최대 검색 수

print('검색 키워드 목록:')
for genre, keywords in GENRE_KEYWORDS.items():
    print(f'  [{genre}] {" | ".join(keywords)}')


# ## 4. 키워드별 영상 ID 검색

# In[5]:


def search_videos_by_keyword(client, keyword: str, max_results: int = 50) -> list[str]:
    """키워드로 YouTube 동영상을 검색하고 video_id 목록을 반환한다."""
    video_ids = []
    try:
        search_results = client.search().list(
            q                 = keyword,
            type              = 'video',
            part              = 'id',
            maxResults        = max_results,
            order             = 'relevance',
            relevanceLanguage = 'ko',
            regionCode        = 'KR'
        ).execute()

        for item in search_results.get('items', []):
            video_ids.append(item['id']['videoId'])

    except Exception as e:
        print(f'[ERROR] 검색 실패 ({keyword}): {e}')

    return video_ids


# ## 5. 영상 상세 정보 수집

# In[6]:


def parse_duration_to_seconds(iso_duration: str) -> int:
    """ISO 8601 재생시간 문자열(PT1H30M45S)을 초 단위 정수로 변환한다."""
    if not iso_duration:
        return 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso_duration)
    if not match:
        return 0
    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    return h * 3600 + m * 60 + s


def fetch_video_details(client, keyword: str, genre: str, video_ids: list[str]) -> list[dict]:
    """video_id 목록으로 영상 상세 정보(통계, 재생시간)를 50개씩 배치 수집한다."""
    video_list = []

    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i + 50]
        try:
            res = client.videos().list(
                id   = ','.join(chunk),
                part = 'snippet,statistics,contentDetails'
            ).execute()

            for item in res.get('items', []):
                snippet  = item.get('snippet', {})
                stats    = item.get('statistics', {})
                content  = item.get('contentDetails', {})

                duration_sec = parse_duration_to_seconds(content.get('duration', ''))
                video_id     = item['id']

                video_list.append({
                    'keyword':       keyword,
                    'genre':         genre,
                    'video_id':      video_id,
                    'title':         snippet.get('title', ''),
                    'channel':       snippet.get('channelTitle', ''),
                    'published_at':  snippet.get('publishedAt', ''),
                    'duration_sec':  duration_sec,
                    'view_count':    stats.get('viewCount'),
                    'like_count':    stats.get('likeCount'),
                    'comment_count': stats.get('commentCount'),
                    'url':           f'https://www.youtube.com/watch?v={video_id}'
                })

        except Exception as e:
            print(f'[ERROR] 상세 수집 실패 (chunk {i}~{i+50}): {e}')

    return video_list


# ## 6. 장르별 전체 수집 실행

# In[7]:


# 장르 → 키워드 순서로 순회하며 영상 수집
all_video_list = []

for genre, keywords in GENRE_KEYWORDS.items():
    for keyword in keywords:
        print(f'[{genre}] "{keyword}" 검색 중...')

        video_ids    = search_videos_by_keyword(youtube_client, keyword, SEARCH_MAX_RESULTS)
        search_results = fetch_video_details(youtube_client, keyword, genre, video_ids)

        all_video_list.extend(search_results)
        print(f'       수집: {len(search_results)}개')

print(f'\n전체 수집 합계: {len(all_video_list)}개')


# ## 7. 롱폼 필터링 및 DataFrame 정리

# In[8]:


def build_longform_dataframe(video_list: list[dict], min_seconds: int = 600) -> pd.DataFrame:
    """10분 이상 영상만 필터링하고 컬럼 타입을 정리한 DataFrame을 반환한다."""
    df = pd.DataFrame(video_list)

    # 롱폼 필터링 (기준 초 이상)
    df = df[df['duration_sec'] >= min_seconds].copy()

    # 수치형: 결측치 0으로 채우고 정수 변환
    num_cols = ['view_count', 'like_count', 'comment_count']
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    # 문자형: 결측치 빈 문자열로 채우기
    str_cols = ['keyword', 'genre', 'video_id', 'title', 'channel', 'published_at', 'url']
    for col in str_cols:
        df[col] = df[col].fillna('')

    # 최종 컬럼 순서 정렬 및 duration_sec 제거
    final_cols = ['keyword', 'genre', 'video_id', 'title', 'channel',
                  'published_at', 'view_count', 'like_count', 'comment_count', 'url']
    df = df[final_cols]

    # 중복 video_id 제거 (동일 영상이 여러 키워드에서 검색된 경우 첫 번째 유지)
    df = df.drop_duplicates(subset='video_id').reset_index(drop=True)

    return df


df = build_longform_dataframe(all_video_list, min_seconds=LONGFORM_MIN_SECONDS)

print(f'롱폼 필터링 후: {len(df)}개')
print('\n장르별 영상 수:')
print(df['genre'].value_counts())
df.head()


# ## 8. MySQL 저장

# In[9]:


def save_to_mysql(df: pd.DataFrame, engine, table: str = 'longform_dramas') -> None:
    """DataFrame을 MySQL 테이블에 저장한다. 기존 테이블은 대체한다."""
    try:
        df.to_sql(
            name      = table,
            con       = engine,
            if_exists = 'replace',
            index     = False,
            chunksize = 500
        )
        with engine.connect() as conn:
            count = conn.execute(text(f'SELECT COUNT(*) FROM `{table}`')).scalar()
        print(f'저장 완료: {count}개 레코드 → {mysql_db}.{table}')
    except Exception as e:
        print(f'[ERROR] MySQL 저장 실패: {e}')
        raise


save_to_mysql(df, engine)


# ## 9. 저장 결과 확인

# In[10]:


def load_genre_summary(engine, table: str = 'longform_dramas') -> pd.DataFrame:
    """장르·키워드별 영상 수와 평균 조회수를 조회한다."""
    try:
        summary = pd.read_sql(
            text(f'''
                SELECT
                    genre,
                    keyword,
                    COUNT(*)               AS video_count,
                    ROUND(AVG(view_count))    AS avg_views,
                    ROUND(AVG(like_count))    AS avg_likes,
                    ROUND(AVG(comment_count)) AS avg_comments
                FROM `{table}`
                GROUP BY genre, keyword
                ORDER BY genre, keyword
            '''),
            con=engine
        )
        return summary
    except Exception as e:
        print(f'[ERROR] 요약 조회 실패: {e}')
        raise


summary = load_genre_summary(engine)
print('=== 장르·키워드별 롱폼 영상 요약 ===')
display(summary)


# In[11]:


def load_top_videos(engine, n: int = 10, table: str = 'longform_dramas') -> pd.DataFrame:
    """조회수 상위 영상 목록을 반환한다."""
    try:
        return pd.read_sql(
            text(f'''
                SELECT genre, keyword, title, channel, view_count, url
                FROM `{table}`
                ORDER BY view_count DESC
                LIMIT {n}
            '''),
            con=engine
        )
    except Exception as e:
        print(f'[ERROR] TOP 영상 조회 실패: {e}')
        raise


top10 = load_top_videos(engine)
print('=== 조회수 TOP 10 ===')
display(top10)

