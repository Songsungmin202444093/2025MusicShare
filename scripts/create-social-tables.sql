-- 소셜 커뮤니티 기능을 위한 테이블 생성 스크립트

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_posts_created_at (created_at DESC),
    INDEX idx_posts_user_id (user_id)
);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_user_like (post_id, user_id),
    INDEX idx_post_likes_post_id (post_id),
    INDEX idx_post_likes_user_id (user_id)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comments_post_id (post_id),
    INDEX idx_comments_user_id (user_id),
    INDEX idx_comments_created_at (created_at DESC)
);

-- 좋아요 카운트 업데이트를 위한 트리거
CREATE TRIGGER update_likes_count_after_insert
    AFTER INSERT ON post_likes
    FOR EACH ROW
    UPDATE posts 
    SET likes_count = (
        SELECT COUNT(*) FROM post_likes WHERE post_id = NEW.post_id
    ) 
    WHERE id = NEW.post_id;

CREATE TRIGGER update_likes_count_after_delete
    AFTER DELETE ON post_likes
    FOR EACH ROW
    UPDATE posts 
    SET likes_count = (
        SELECT COUNT(*) FROM post_likes WHERE post_id = OLD.post_id
    ) 
    WHERE id = OLD.post_id;

-- 댓글 카운트 업데이트를 위한 트리거
CREATE TRIGGER update_comments_count_after_insert
    AFTER INSERT ON post_comments
    FOR EACH ROW
    UPDATE posts 
    SET comments_count = (
        SELECT COUNT(*) FROM post_comments WHERE post_id = NEW.post_id
    ) 
    WHERE id = NEW.post_id;

CREATE TRIGGER update_comments_count_after_delete
    AFTER DELETE ON post_comments
    FOR EACH ROW
    UPDATE posts 
    SET comments_count = (
        SELECT COUNT(*) FROM post_comments WHERE post_id = OLD.post_id
    ) 
    WHERE id = OLD.post_id