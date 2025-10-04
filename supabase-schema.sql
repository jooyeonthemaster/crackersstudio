-- ============================================
-- Crackers Studio - Books Table Schema
-- ============================================

-- 1. Books 테이블 생성
CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  cover_image TEXT NOT NULL,
  audio_file TEXT NOT NULL,
  description TEXT,
  genre VARCHAR(100) DEFAULT 'Character',
  published_year INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_books_display_order ON books(display_order);
CREATE INDEX idx_books_genre ON books(genre);

-- 3. 자동 업데이트 시간 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. 샘플 데이터 삽입 (초기 데이터)
INSERT INTO books (title, author, cover_image, audio_file, description, genre, published_year, display_order)
VALUES
  ('토끼 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/38f44f6d8209f.png', '/audio/rabbit.mp3', '귀여운 토끼 캐릭터입니다', 'Character', 2024, 1),
  ('곰 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/9318aa38c687d.png', '/audio/bear.mp3', '따뜻한 곰 캐릭터입니다', 'Character', 2024, 2),
  ('고양이 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/e927347749a74.png', '/audio/cat.mp3', '사랑스러운 고양이 캐릭터입니다', 'Character', 2024, 3),
  ('여우 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/a5ed1506d849f.png', '/audio/fox.mp3', '똑똑한 여우 캐릭터입니다', 'Character', 2024, 4),
  ('사슴 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/cdb3d1e8d380a.png', '/audio/deer.mp3', '우아한 사슴 캐릭터입니다', 'Character', 2024, 5),
  ('펭귄 크랙이', 'Little Crack', 'https://cdn.imweb.me/thumbnail/20250527/c5ea4ef8a3a7e.png', '/audio/penguin.mp3', '깜찍한 펭귄 캐릭터입니다', 'Character', 2024, 6)
ON CONFLICT DO NOTHING;

-- 5. Row Level Security (RLS) 설정
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Enable read access for all users" ON books
  FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능 (어드민 페이지용)
CREATE POLICY "Enable insert for authenticated users only" ON books
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON books
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON books
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 마이그레이션 완료!
-- ============================================
