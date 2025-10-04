-- ============================================
-- Books 테이블 RLS 정책 수정
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON books;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON books;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON books;

-- 새 정책: 모든 사용자 (anon 포함) 쓰기 가능
CREATE POLICY "Enable insert for all users" ON books
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON books
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON books
  FOR DELETE USING (true);

-- ============================================
-- 완료! 이제 Admin 페이지에서 배포 가능합니다
-- ============================================

