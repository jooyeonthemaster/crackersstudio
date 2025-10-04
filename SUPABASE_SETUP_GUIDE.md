# 🚀 Supabase 데이터베이스 설정 가이드

## 📋 **1단계: SQL 실행 (5분 소요)**

### 방법 1: 웹 대시보드에서 실행 ⭐ **추천**

1. **Supabase 대시보드 열기**
   ```
   https://supabase.com/dashboard/project/dylloavkiyqfnqglaryw
   ```

2. **SQL Editor 클릭**
   - 왼쪽 메뉴 → **SQL Editor** 클릭

3. **New Query 클릭**
   - 상단 **+ New Query** 버튼 클릭

4. **SQL 붙여넣기**
   - `supabase-schema.sql` 파일 전체 내용 복사
   - 에디터에 붙여넣기

5. **Run 클릭** (Ctrl+Enter)
   - 하단 **Run** 버튼 클릭
   - ✅ Success 메시지 확인

---

## ✅ **2단계: 설정 확인**

SQL 실행 후 다음 명령어로 확인:

```bash
cd /c/Users/jooye/Desktop/2025crackersstudio
npx tsx scripts/setup-supabase.ts
```

**예상 출력:**
```
🚀 Supabase 데이터베이스 설정 시작...
📝 초기 데이터 삽입 중...
✅ 초기 데이터 삽입 완료!

📚 현재 저장된 책 목록:
┌─────┬──────────────┬───────────────┬─────────────┐
│ id  │ title        │ author        │ genre       │
├─────┼──────────────┼───────────────┼─────────────┤
│ 1   │ 토끼 크랙이  │ Little Crack  │ Character   │
│ 2   │ 곰 크랙이    │ Little Crack  │ Character   │
...
```

---

## 🎯 **빠른 확인 방법**

### Supabase Table Editor에서 확인
1. 대시보드 → **Table Editor**
2. **books** 테이블 선택
3. 6개 캐릭터 데이터 확인

---

## ⚡ **자동화 옵션 (선택)**

SQL 실행 후 이 명령어 한 번만 실행:

```bash
npm install -D tsx
npx tsx scripts/setup-supabase.ts
```

이미 테이블이 있으면 데이터만 추가됩니다!

---

## 🆘 **문제 해결**

### "relation does not exist" 오류
→ SQL 실행을 먼저 해야 합니다 (1단계)

### "duplicate key value" 오류
→ 이미 데이터가 있습니다 (정상)

### RLS 오류
→ SQL의 RLS 정책 부분도 실행했는지 확인

---

**준비 완료!** ✨
