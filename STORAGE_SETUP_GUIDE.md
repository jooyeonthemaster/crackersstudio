# 📦 Supabase Storage 설정 가이드

## 🎯 Storage 버킷 생성하기

Supabase Storage에 이미지와 음성 파일을 업로드하려면 먼저 버킷(Bucket)을 생성해야 합니다.

---

## 🚀 설정 단계

### 1️⃣ Supabase 대시보드 접속
```
https://supabase.com/dashboard/project/dylloavkiyqfnqglaryw
```

### 2️⃣ Storage 메뉴로 이동
1. 왼쪽 사이드바에서 **Storage** 클릭
2. **"New bucket"** 버튼 클릭

### 3️⃣ 이미지 버킷 생성
**Bucket 설정:**
- **Name**: `images`
- **Public bucket**: ✅ **체크** (공개 접근 허용)
- **File size limit**: 5 MB (권장)
- **Allowed MIME types**: `image/*`

**"Create bucket"** 버튼 클릭!

### 4️⃣ 음성 파일 버킷 생성
**다시 "New bucket" 버튼 클릭**

**Bucket 설정:**
- **Name**: `audio`
- **Public bucket**: ✅ **체크** (공개 접근 허용)
- **File size limit**: 10 MB (권장)
- **Allowed MIME types**: `audio/*,video/*`

**"Create bucket"** 버튼 클릭!

---

## 📋 완료 체크리스트

생성 완료 후 다음을 확인하세요:

- [ ] `images` 버킷이 생성되었나요?
- [ ] `audio` 버킷이 생성되었나요?
- [ ] 두 버킷 모두 **Public** 설정이 되어있나요?

---

## 🔧 Storage Policies (선택사항)

더 세밀한 권한 제어가 필요하면 Storage Policies를 설정하세요:

### Images 버킷 Policy
```sql
-- 모든 사용자가 이미지 읽기 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

### Audio 버킷 Policy
```sql
-- 모든 사용자가 음성 파일 읽기 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'audio' );

-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'audio' AND auth.role() = 'authenticated' );
```

---

## ✅ 테스트

버킷 생성 후 Admin 페이지에서:

1. **새 카드 추가** 버튼 클릭
2. 이미지 파일 선택 → 업로드 확인
3. 음성 파일 (MP3/MP4) 선택 → 업로드 확인

업로드 성공 시 **"✅ 업로드 완료!"** 메시지가 표시됩니다! 🎉

---

## 🐛 문제 해결

### 업로드 실패 시
1. 버킷 이름이 정확한지 확인 (`images`, `audio`)
2. Public 설정이 활성화되어 있는지 확인
3. 파일 크기 제한을 초과하지 않았는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 파일이 보이지 않을 때
1. Storage → 해당 버킷 클릭
2. 업로드된 파일 목록 확인
3. Public URL이 생성되었는지 확인

---

## 💡 참고

- **이미지 권장 포맷**: JPG, PNG, WebP
- **음성 권장 포맷**: MP3, MP4, M4A
- **파일명**: 자동으로 고유한 이름이 생성됩니다
- **URL**: Supabase Storage의 Public URL이 자동으로 반환됩니다

---

준비 완료! 이제 Admin 페이지에서 파일을 업로드할 수 있습니다! 🚀








