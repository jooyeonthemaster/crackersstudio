'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { uploadImage, uploadAudio, fetchBooks } from '@/lib/supabase';
import { cleanSectionContent } from '@/lib/editorUtils';
import CharacterEditor from '@/components/editor/CharacterEditor';
import { X, Save } from 'lucide-react';
import Image from 'next/image';
import { Book } from '@/types';

const STORAGE_KEY = 'crackers_studio_books_draft';

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    audioFile: '',
    description: '',
    content: '',
    genre: '',
    publishedYear: '',
  });

  // 파일 업로드 관련 상태
  const [imagePreview, setImagePreview] = useState('');
  const [audioPreview, setAudioPreview] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (bookId && !error) {
      loadBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadBook = async () => {
    try {
      setError(null);
      
      // 클라이언트 사이드 체크
      if (typeof window === 'undefined') {
        return;
      }

      // localStorage에서 모든 책 데이터 가져오기
      const stored = localStorage.getItem(STORAGE_KEY);
      let books: Book[] = [];

      if (stored) {
        try {
          books = JSON.parse(stored);
        } catch (parseError) {
          console.error('localStorage 파싱 실패:', parseError);
          // 파싱 실패 시 Supabase에서 로드
          books = await fetchBooks();
        }
      } else {
        // localStorage 없으면 Supabase에서 로드
        books = await fetchBooks();
      }

      const foundBook = books.find(b => b.id === parseInt(bookId));

      if (!foundBook) {
        throw new Error('책을 찾을 수 없습니다.');
      }

      setBook(foundBook);
      setFormData({
        title: foundBook.title || '',
        author: foundBook.author || '',
        coverImage: foundBook.coverImage || '',
        audioFile: foundBook.audioFile || '',
        description: foundBook.description || '',
        content: foundBook.content || '',
        genre: foundBook.genre || 'Character',
        publishedYear: foundBook.publishedYear?.toString() || '',
      });
      // 미리보기 상태 초기화
      setImagePreview(foundBook.coverImage || '');
      setAudioPreview(foundBook.audioFile || '');
      setAudioFileName(foundBook.audioFile ? foundBook.audioFile.split('/').pop() || '' : '');
    } catch (error) {
      console.error('책 로딩 실패:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      alert('책을 불러오는데 실패했습니다.');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 실제 업로드
      setIsUploading(true);
      setUploadStatus('이미지 업로드 중...');

      const { url, error } = await uploadImage(file);

      setIsUploading(false);

      if (error) {
        setUploadStatus(`업로드 실패: ${error}`);
        alert(`이미지 업로드 실패: ${error}`);
      } else {
        setUploadStatus('이미지 업로드 완료!');
        setFormData(prev => ({ ...prev, coverImage: url }));
        setTimeout(() => setUploadStatus(''), 2000);
      }
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);

      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 실제 업로드
      setIsUploading(true);
      setUploadStatus('음성 파일 업로드 중...');

      const { url, error } = await uploadAudio(file);

      setIsUploading(false);

      if (error) {
        setUploadStatus(`업로드 실패: ${error}`);
        alert(`음성 파일 업로드 실패: ${error}`);
      } else {
        setUploadStatus('음성 파일 업로드 완료!');
        setFormData(prev => ({ ...prev, audioFile: url }));
        setTimeout(() => setUploadStatus(''), 2000);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      // 클라이언트 사이드 체크
      if (typeof window === 'undefined') {
        throw new Error('클라이언트 환경에서만 저장할 수 있습니다.');
      }

      // localStorage에서 모든 책 데이터 가져오기
      const stored = localStorage.getItem(STORAGE_KEY);
      let books: Book[] = [];

      if (stored) {
        try {
          books = JSON.parse(stored);
        } catch (parseError) {
          console.error('localStorage 파싱 실패:', parseError);
          // 파싱 실패 시 Supabase에서 로드
          books = await fetchBooks();
        }
      } else {
        // localStorage 없으면 Supabase에서 로드
        books = await fetchBooks();
      }

      const bookIndex = books.findIndex(b => b.id === parseInt(bookId));

      if (bookIndex === -1) {
        throw new Error('책을 찾을 수 없습니다.');
      }

      // 수정된 데이터로 업데이트
      const updatedBook: Book = {
        ...books[bookIndex],
        title: formData.title,
        author: formData.author || '',
        coverImage: formData.coverImage || '',
        audioFile: formData.audioFile || undefined,
        description: formData.description || undefined,
        content: formData.content ? cleanSectionContent(formData.content) : undefined,
        genre: formData.genre || 'Character',
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
      };

      // 배열에서 해당 책 교체
      books[bookIndex] = updatedBook;

      // localStorage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

      alert('저장되었습니다! (📝 Draft 모드에 저장되었습니다. 메인 페이지에 반영하려면 "배포하기" 버튼을 눌러주세요.)');
      router.push('/admin');
    } catch (error) {
      console.error('저장 실패:', error);
      alert(`저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-yellow-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">책 편집</h1>
              <p className="text-sm text-gray-600 mt-1">{book?.title}</p>
              {uploadStatus && (
                <p className="text-sm mt-1 font-medium text-green-600">
                  {isUploading ? '⏳' : '✅'} {uploadStatus}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin')}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || isUploading}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? '저장 중...' : isUploading ? '업로드 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border-2 border-yellow-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📚 기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="책 제목"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">작가</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="작가"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">장르</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="예: Character"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">출판 연도</label>
                <input
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="예: 2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🖼️ 커버 이미지
                </label>
                <div className="flex gap-4 items-start">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                    className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-yellow-300 shadow-lg flex-shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  또는 이미지 URL을 아래에 직접 입력하세요
                </p>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => {
                      setFormData({ ...formData, coverImage: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="mt-2 w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                    placeholder="https://example.com/image.png"
                  />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🎵 오디오 파일
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3,audio/mp4,video/mp4,.mp3,.mp4"
                    onChange={handleAudioChange}
                    disabled={isUploading}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {audioPreview && (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🎧</span>
                        <span className="text-sm font-medium text-gray-700 truncate flex-1">
                          {audioFileName || '음성 파일'}
                        </span>
                      </div>
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full"
                        style={{ height: '40px' }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    또는 음성 파일 URL을 아래에 직접 입력하세요
                  </p>
                  <input
                    type="text"
                    value={formData.audioFile}
                    onChange={(e) => {
                      setFormData({ ...formData, audioFile: e.target.value });
                      setAudioPreview(e.target.value);
                      setAudioFileName(e.target.value.split('/').pop() || '');
                    }}
                    className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                    placeholder="/audio/character.mp3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border-2 border-yellow-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 설명</h2>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400 min-h-[120px]"
              placeholder="책 소개 및 설명을 입력하세요..."
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">✏️ 상세 내용 (리치 에디터)</h2>
            <CharacterEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="상세 내용을 작성하세요. 이미지, 링크, 테이블, 접을 수 있는 섹션 등을 추가할 수 있습니다!"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="sticky bottom-0 bg-white border-t-2 border-yellow-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => router.push('/admin')}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving || isUploading}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? '저장 중...' : isUploading ? '업로드 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
