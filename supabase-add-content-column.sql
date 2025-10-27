-- books 테이블에 content 컬럼 추가 (TipTap HTML 저장용)
ALTER TABLE books
ADD COLUMN IF NOT EXISTS content TEXT;

-- 기존 description을 content로 복사 (선택사항)
-- UPDATE books SET content = description WHERE content IS NULL;

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_books_content ON books USING gin(to_tsvector('english', content));

COMMENT ON COLUMN books.content IS 'TipTap 에디터로 작성된 HTML 컨텐츠 (블로그 형태)';
