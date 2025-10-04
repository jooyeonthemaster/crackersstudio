# 📊 Supabase 데이터 구조 매핑 분석

## ✅ **매핑 상태: 완벽 호환**

---

## 🗺️ **필드 매핑 테이블**

| 현재 구조 (TypeScript) | Supabase 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| `id: number` | `id` | BIGSERIAL | ✅ | 자동 증가 Primary Key |
| `title: string` | `title` | VARCHAR(255) | ✅ | 캐릭터 이름 |
| `author: string` | `author` | VARCHAR(255) | ✅ | 작가/시리즈명 |
| `coverImage: string` | `cover_image` | TEXT | ✅ | 이미지 URL (snake_case) |
| `audioFile: string` | `audio_file` | TEXT | ✅ | 음성 파일 경로 (snake_case) |
| `description?: string` | `description` | TEXT | ⚪ | 캐릭터 설명 (NULL 가능) |
| `genre?: string` | `genre` | VARCHAR(100) | ⚪ | 장르 (기본값: "Character") |
| `publishedYear?: number` | `published_year` | INTEGER | ⚪ | 발행 연도 (snake_case) |
| **NEW** | `display_order` | INTEGER | ✅ | 드래그 앤 드롭 순서 저장 |
| **NEW** | `created_at` | TIMESTAMPTZ | ✅ | 생성 시간 (자동) |
| **NEW** | `updated_at` | TIMESTAMPTZ | ✅ | 수정 시간 (자동) |
| ~~`isPlaying`~~ | ❌ 제외 | - | - | UI 전용 상태 (DB 불필요) |
| ~~`showCopyrightPopup`~~ | ❌ 제외 | - | - | UI 전용 상태 (DB 불필요) |
| ~~`isPictureBook`~~ | ❌ 제외 | - | - | UI 전용 상태 (DB 불필요) |

---

## 🔄 **Naming Convention 변환**

### **camelCase → snake_case**
```typescript
// TypeScript (현재)
{
  coverImage: "https://...",
  audioFile: "/audio/...",
  publishedYear: 2024
}

// Supabase (데이터베이스)
{
  cover_image: "https://...",
  audio_file: "/audio/...",
  published_year: 2024
}
```

### **변환 헬퍼 함수 필요**
```typescript
// DB → App
const toApp = (dbBook) => ({
  ...dbBook,
  coverImage: dbBook.cover_image,
  audioFile: dbBook.audio_file,
  publishedYear: dbBook.published_year
});

// App → DB
const toDB = (appBook) => ({
  ...appBook,
  cover_image: appBook.coverImage,
  audio_file: appBook.audioFile,
  published_year: appBook.publishedYear
});
```

---

## 🆕 **추가된 Supabase 기능**

### 1. **display_order (순서 관리)**
- 드래그 앤 드롭으로 변경된 순서를 저장
- `ORDER BY display_order ASC`로 정렬

### 2. **created_at / updated_at (타임스탬프)**
- 자동으로 생성/수정 시간 기록
- Trigger로 `updated_at` 자동 업데이트

### 3. **Row Level Security (RLS)**
```sql
-- 읽기: 모든 사용자 가능
CREATE POLICY "Enable read access for all users"
  FOR SELECT USING (true);

-- 쓰기: 인증된 사용자만 (어드민)
CREATE POLICY "Enable write for authenticated users"
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 📝 **Supabase 설정 가이드**

### **1단계: 테이블 생성**
Supabase 대시보드 → SQL Editor에서 실행:
```bash
파일: supabase-schema.sql
```

### **2단계: 환경 변수 확인**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://dylloavkiyqfnqglaryw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### **3단계: 클라이언트 사용**
```typescript
import { supabase } from '@/lib/supabase';

// 전체 조회
const { data } = await supabase
  .from('books')
  .select('*')
  .order('display_order', { ascending: true });

// 추가
const { data, error } = await supabase
  .from('books')
  .insert({
    title: '토끼 크랙이',
    author: 'Little Crack',
    cover_image: 'https://...',
    audio_file: '/audio/rabbit.mp3',
    display_order: 1
  });

// 수정
const { data, error } = await supabase
  .from('books')
  .update({ title: '토끼 크랙이 V2' })
  .eq('id', 1);

// 삭제
const { error } = await supabase
  .from('books')
  .delete()
  .eq('id', 1);
```

---

## ⚠️ **주의사항**

### **1. 기존 LocalStorage 데이터**
- 현재: `useBookManagement` 훅이 `localStorage` 사용
- 변경 필요: Supabase API로 마이그레이션

### **2. 네이밍 컨벤션**
- JavaScript: `camelCase`
- PostgreSQL: `snake_case`
- 자동 변환 필요!

### **3. 인증 필요**
- 현재: 어드민 페이지 인증 없음
- 권장: Supabase Auth로 보호

---

## 🚀 **다음 단계**

1. ✅ Supabase 테이블 생성 (`supabase-schema.sql` 실행)
2. ⬜ `useBookManagement` 훅을 Supabase로 마이그레이션
3. ⬜ 네이밍 컨벤션 변환 유틸 작성
4. ⬜ 어드민 인증 추가 (선택사항)
5. ⬜ 이미지 업로드를 Supabase Storage로 변경 (선택사항)

---

## 📁 **생성된 파일**

- `supabase-schema.sql` - 테이블 생성 SQL
- `types/database.ts` - Supabase 타입 정의
- `lib/supabase.ts` - 타입 안전 클라이언트
- `.env.local` - 환경 변수

**매핑 호환성: 100% ✅**
