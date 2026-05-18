CREATE DATABASE IF NOT EXISTS vigloo_youtube_db
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE vigloo_youtube_db;

-- 작품 테이블
CREATE TABLE vigloo (
    work_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    tag_desc VARCHAR(255),
    country VARCHAR(100),
    genre VARCHAR(255),
    story TEXT,
    total_episodes INT,
    url TEXT
);

-- 유튜브 테이블
CREATE TABLE youtube (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id INT NOT NULL,
    title VARCHAR(255),
    search_keyword VARCHAR(255),
    video_id VARCHAR(100),
    video_title TEXT,
    channel_name VARCHAR(255),
    upload_date DATETIME,
    views INT,
    likes INT,
    comment_count INT,
    video_url TEXT,
    comment_author VARCHAR(255),
    comment_text TEXT,
    comment_likes INT,
    comment_date DATETIME,

    FOREIGN KEY (work_id) REFERENCES vigloo(work_id)
);

SHOW TABLES;
SELECT * FROM vigloo;
SELECT * FROM youtube;