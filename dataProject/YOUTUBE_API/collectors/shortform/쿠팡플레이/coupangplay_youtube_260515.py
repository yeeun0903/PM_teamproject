#!/usr/bin/env python
# coding: utf-8

# # SNL 코리아 롱폼 vs 숏폼 YouTube 영상 통계 수집
# YouTube Data API v3로 SNL 코리아 채널의 영상 데이터를 수집해 MySQL DB에 저장합니다.

# ## 0. 환경 설정 및 라이브러리 로드

# In[3]:


get_ipython().system('pip install google-api-python-client')


# In[3]:


import os
import re
import pandas as pd
from datetime import datetime, timezone
from dotenv import load_dotenv
from googleapiclient.discovery import build
from sqlalchemy import create_engine, text
import pymysql

load_dotenv()

API_KEY      = os.getenv('YOUTUBE_API_KEY')
MYSQL_HOST   = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_USER   = os.getenv('MYSQL_USER', 'root')
MYSQL_PW     = os.getenv('MYSQL_PASSWORD', '')
MYSQL_DB     = os.getenv('MYSQL_DB', 'youtube_data')

assert API_KEY, '.env에 YOUTUBE_API_KEY가 없습니다.'

print(f'API KEY  : {API_KEY[:8]}...')
print(f'MySQL    : {MYSQL_USER}@{MYSQL_HOST}/{MYSQL_DB}')


# ## 1. YouTube API 클라이언트 초기화

# In[4]:


def build_youtube_client(api_key: str):
    try:
        client = build('youtube', 'v3', developerKey=api_key)
        print('YouTube API 클라이언트 초기화 완료')
        return client
    except Exception as e:
        print(f'[ERROR] YouTube 클라이언트 초기화 실패: {e}')
        raise

youtube = build_youtube_client(API_KEY)


# ## 2. MySQL DB 및 엔진 생성

# In[5]:


def create_db_engine(host: str, user: str, pw: str, db: str):
    try:
        # DB가 없으면 먼저 생성
        conn = pymysql.connect(host=host, user=user, password=pw, charset='utf8mb4')
        with conn.cursor() as cur:
            cur.execute(f'CREATE DATABASE IF NOT EXISTS `{db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
        conn.close()

        url = f'mysql+pymysql://{user}:{pw}@{host}/{db}?charset=utf8mb4'
        engine = create_engine(url)
        with engine.connect() as c:
            c.execute(text('SELECT 1'))
        print(f'MySQL 연결 성공: {user}@{host}/{db}')
        return engine
    except Exception as e:
        print(f'[ERROR] MySQL 연결 실패: {e}')
        raise

engine = create_db_engine(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB)


# ## 3. SNL 코리아 채널 ID 조회

# In[6]:


def search_channel(client, query: str, max_results: int = 5) -> list[dict]:
    try:
        res = client.search().list(
            q=query,
            type='channel',
            part='snippet',
            maxResults=max_results
        ).execute()
        channels = [
            {
                'channel_id': item['snippet']['channelId'],
                'title':      item['snippet']['title'],
                'desc':       item['snippet']['description'][:60]
            }
            for item in res.get('items', [])
        ]
        return channels
    except Exception as e:
        print(f'[ERROR] 채널 검색 실패: {e}')
        return []

channels = search_channel(youtube, 'SNL 코리아')
for i, ch in enumerate(channels):
    print(f'[{i}] {ch["title"]} | {ch["channel_id"]}')


# In[7]:


CHANNEL_ID = 'UCjn-VbcIkAeXQKCmLJV8YwQ'
print(f'선택된 채널: 쿠팡플레이 ({CHANNEL_ID})')


# ## 4. 전체 영상 ID 수집

# In[8]:


def get_uploads_playlist_id(client, channel_id: str) -> str:
    try:
        res = client.channels().list(
            id=channel_id,
            part='contentDetails'
        ).execute()
        return res['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    except Exception as e:
        print(f'[ERROR] 플레이리스트 ID 조회 실패: {e}')
        raise


def get_all_video_ids(client, playlist_id: str) -> list[str]:
    video_ids = []
    next_page_token = None
    try:
        while True:
            res = client.playlistItems().list(
                playlistId=playlist_id,
                part='contentDetails',
                maxResults=50,
                pageToken=next_page_token
            ).execute()
            for item in res.get('items', []):
                video_ids.append(item['contentDetails']['videoId'])
            next_page_token = res.get('nextPageToken')
            if not next_page_token:
                break
    except Exception as e:
        print(f'[ERROR] 영상 ID 수집 중 오류 (수집된 수: {len(video_ids)}): {e}')
    return video_ids


playlist_id = get_uploads_playlist_id(youtube, CHANNEL_ID)
video_ids   = get_all_video_ids(youtube, playlist_id)
print(f'수집된 영상 수: {len(video_ids)}개')


# ## 5. 영상 상세 정보 수집 및 롱폼/숏폼 분류

# In[9]:


import re

def parse_duration(duration_iso):
    if not duration_iso:
        return 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_iso)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


# In[10]:


# def classify_content_type(duration_seconds: int, title: str) -> str:
#     if duration_seconds <= 60 or '#shorts' in title.lower() or '#short' in title.lower():
#         return 'shortform'
#     return 'longform'
def classify_content_type(duration_seconds: int, title: str) -> str:
    """#Shorts 태그 있거나 60초 이하 = 숏폼, 나머지 = 롱폼"""
    if '#shorts' in title.lower() or '#short' in title.lower() or duration_seconds <= 60:
        return 'shortform'
    else:
        return 'longform'

def fetch_video_details(client, ids: list[str]) -> list[dict]:
    records = []
    for i in range(0, len(ids), 50):
        chunk = ids[i:i+50]
        try:
            res = client.videos().list(
                id=','.join(chunk),
                part='snippet,statistics,contentDetails'
            ).execute()
            for item in res.get('items', []):
                snippet = item.get('snippet', {})
                stats   = item.get('statistics', {})
                content = item.get('contentDetails', {})

                duration_iso = content.get('duration', 'PT0S')
                duration_sec = parse_duration(duration_iso)

                title = snippet.get('title', '')
                records.append({
                    'video_id':        item['id'],
                    'title':           title,
                    'published_at':    snippet.get('publishedAt', ''),
                    'duration':        duration_iso,
                    'duration_seconds': duration_sec,
                    'view_count':      stats.get('viewCount'),
                    'like_count':      stats.get('likeCount'),
                    'comment_count':   stats.get('commentCount'),
                    'content_type':    classify_content_type(duration_sec, title),
                    'collected_at':    datetime.now(timezone.utc).isoformat()
                })
        except Exception as e:
            print(f'[ERROR] 영상 상세 수집 실패 (chunk {i}~{i+50}): {e}')
    return records


records = fetch_video_details(youtube, video_ids)
print(f'상세 수집 완료: {len(records)}개')


# ## 6. DataFrame 정리 (타입 변환 + fillna)

# In[11]:


def build_dataframe(records: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(records)

    num_cols = ['duration_seconds', 'view_count', 'like_count', 'comment_count']
    str_cols = ['video_id', 'title', 'published_at', 'duration', 'content_type', 'collected_at']

    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
    for col in str_cols:
        df[col] = df[col].fillna('')

    return df


df = build_dataframe(records)
print(df.dtypes)
print('\n롱폼/숏폼 분포:')
print(df['content_type'].value_counts())
df.head(3)


# In[14]:


def add_engagement_rates(df):
    try:
        df = df.copy()
        df['like_rate'] = df.apply(
            lambda r: round(r['like_count'] / r['view_count'] * 100, 4)
            if r['view_count'] > 0 else 0.0,
            axis=1
        )
        df['comment_rate'] = df.apply(
            lambda r: round(r['comment_count'] / r['view_count'] * 100, 4)
            if r['view_count'] > 0 else 0.0,
            axis=1
        )
        print('like_rate / comment_rate 컬럼 추가 완료')
        print(df[['video_id', 'content_type', 'like_rate', 'comment_rate']].head())
        return df
    except Exception as e:
        print(f'[ERROR] 참여율 컬럼 추가 실패: {e}')
        raise


df = add_engagement_rates(df)


# ## 7. MySQL 저장

# In[15]:


def save_to_mysql(df: pd.DataFrame, engine, table: str = 'snl_videos'):
    try:
        df.to_sql(
            name=table,
            con=engine,
            if_exists='replace',
            index=False,
            chunksize=500
        )
        with engine.connect() as conn:
            count = conn.execute(text(f'SELECT COUNT(*) FROM `{table}`')).scalar()
        print(f'저장 완료: {count}개 레코드 → {MYSQL_DB}.{table}')
    except Exception as e:
        print(f'[ERROR] MySQL 저장 실패: {e}')
        raise


save_to_mysql(df, engine)


# ## 8. 저장 결과 확인

# In[16]:


def load_summary(engine, table: str = 'snl_videos') -> pd.DataFrame:
    try:
        summary = pd.read_sql(
            f'''
            SELECT
                content_type,
                COUNT(*)                       AS video_count,
                ROUND(AVG(view_count))         AS avg_views,
                ROUND(AVG(like_count))         AS avg_likes,
                ROUND(AVG(comment_count))      AS avg_comments,
                ROUND(AVG(duration_seconds))   AS avg_duration_sec
            FROM `{table}`
            GROUP BY content_type
            ''',
            con=engine
        )
        return summary
    except Exception as e:
        print(f'[ERROR] 요약 조회 실패: {e}')
        raise


summary = load_summary(engine)
print('=== SNL 코리아 롱폼 vs 숏폼 요약 ===')
display(summary)


# In[17]:


def load_top_videos(engine, n: int = 10, table: str = 'snl_videos') -> pd.DataFrame:
    try:
        return pd.read_sql(
            f'''
            SELECT video_id, title, content_type, view_count, duration_seconds
            FROM `{table}`
            ORDER BY view_count DESC
            LIMIT {n}
            ''',
            con=engine
        )
    except Exception as e:
        print(f'[ERROR] TOP 영상 조회 실패: {e}')
        raise


top10 = load_top_videos(engine)
print('=== 조회수 TOP 10 ===')
display(top10)


# ## 9. 콘텐츠 유형별 통계 시각화

# In[18]:


from plotly.subplots import make_subplots
import plotly.graph_objects as go


def plot_content_type_stats(summary: pd.DataFrame):
    try:
        order = ['shortform', 'longform']
        label_map = {'shortform': '숏폼', 'longform': '롱폼'}
        colors    = {'shortform': '#42B6FF', 'longform': '#FF7AC8'}

        df_plot = (
            summary
            .set_index('content_type')
            .reindex(order)
            .reset_index()
        )
        df_plot['label'] = df_plot['content_type'].map(label_map)
        bar_colors = [colors[ct] for ct in df_plot['content_type']]

        metrics = [
            ('avg_views',    '평균 조회수'),
            ('avg_likes',    '평균 좋아요수'),
            ('avg_comments', '평균 댓글수'),
        ]

        fig = make_subplots(
            rows=1, cols=3,
            subplot_titles=[m[1] for m in metrics],
            horizontal_spacing=0.1
        )

        for col_pos, (col_name, metric_label) in enumerate(metrics, start=1):
            fig.add_trace(
                go.Bar(
                    x=df_plot['label'],
                    y=df_plot[col_name],
                    marker_color=bar_colors,
                    text=df_plot[col_name].apply(lambda v: f'{v:,.0f}'),
                    textposition='outside',
                    showlegend=False,
                ),
                row=1, col=col_pos
            )

        fig.update_layout(
            title_text='SNL 코리아 — 콘텐츠 유형별 평균 지표',
            title_x=0.5,
            title_font_size=16,
            height=480,
            template='plotly_white',
            margin=dict(t=100, b=60)
        )
        fig.update_yaxes(tickformat=',')
        fig.show()

    except Exception as e:
        print(f'[ERROR] 시각화 실패: {e}')
        raise


plot_content_type_stats(summary)


# ## 10. 콘텐츠 유형별 평균 참여율 시각화

# In[15]:


df['like_rate'] = df['like_count'] / df['view_count'].replace(0, 1) * 100
df['comment_rate'] = df['comment_count'] / df['view_count'].replace(0, 1) * 100

df


# In[16]:


import plotly.graph_objects as go


def plot_engagement_rates(df):
    try:
        order     = ['shortform', 'longform']
        label_map = {'shortform': '숏폼', 'longform': '롱폼'}

        eng = (
            df.groupby('content_type')[['like_rate', 'comment_rate']]
            .mean()
            .reindex(order)
            .reset_index()
        )
        eng['label'] = eng['content_type'].map(label_map)

        fig = go.Figure()

        fig.add_trace(go.Bar(
            name='평균 좋아요율',
            x=eng['label'],
            y=eng['like_rate'].round(4),
            marker_color='#42B6FF',
            text=eng['like_rate'].apply(lambda v: f'{v:.4f}%'),
            textposition='outside'
        ))

        fig.add_trace(go.Bar(
            name='평균 댓글율',
            x=eng['label'],
            y=eng['comment_rate'].round(4),
            marker_color='#FF7AC8',
            text=eng['comment_rate'].apply(lambda v: f'{v:.4f}%'),
            textposition='outside'
        ))

        fig.update_layout(
            title_text='SNL 코리아 — 콘텐츠 유형별 평균 참여율',
            title_x=0.5,
            title_font_size=16,
            barmode='group',
            yaxis_title='참여율 (%)',
            # width=500,
            height=500,
            template='plotly_white',
            legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )
        fig.update_yaxes(tickformat='.4f', ticksuffix='%')
        fig.show()

    except Exception as e:
        print(f'[ERROR] 참여율 시각화 실패: {e}')
        raise


plot_engagement_rates(df)


# In[17]:


# 쿠팡플레이 포맷 분포 파이차트
format_counts = df['content_type'].value_counts()

fig = go.Figure(go.Pie(
    labels=['숏폼', '롱폼'],
    values=[format_counts.get('shortform', 0), format_counts.get('longform', 0)],
    marker=dict(colors=['#42B6FF', '#FF7AC8']),
    textinfo='label+percent',
    hole=0.4
))
fig.update_layout(
    title='쿠팡플레이 유튜브 채널 숏폼 vs 롱폼 업로드 비율',
    template='plotly_white',
    height=500
)
fig.show()


# In[19]:


df.to_csv('/Users/jeong-eunseo/Data/teamProject/PM_dataproject/YOUTUBE_API/collectors/coupangplay/coupangplay_youtube.csv', index=False, encoding='utf-8-sig')
print('CSV 저장 완료')


# In[ ]:





# In[ ]:




