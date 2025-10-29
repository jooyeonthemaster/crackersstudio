'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CharacterEditor from '@/components/editor/CharacterEditor';
import { X, Save } from 'lucide-react';

interface BookDatabase {
  id: number;
  title: string;
  author: string | null;
  cover_image: string | null;
  audio_file: string | null;
  description: string | null;
  content: string | null;
  genre: string | null;
  published_year: number | null;
  display_order: number | null;
}

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_image: '',
    audio_file: '',
    description: '',
    content: '',
    genre: '',
    published_year: '',
  });

  useEffect(() => {
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const loadBook = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Book not found');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBook(data as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bookData = data as any;
      setFormData({
        title: bookData.title || '',
        author: bookData.author || '',
        cover_image: bookData.cover_image || '',
        audio_file: bookData.audio_file || '',
        description: bookData.description || '',
        content: bookData.content || '',
        genre: bookData.genre || 'Character',
        published_year: bookData.published_year?.toString() || '',
      });
    } catch (error) {
      console.error('책 로딩 실패:', error);
      alert('책을 불러오는데 실패했습니다.');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const updateData: Partial<BookDatabase> = {
        title: formData.title,
        author: formData.author || null,
        cover_image: formData.cover_image || null,
        audio_file: formData.audio_file || null,
        description: formData.description || null,
        content: formData.content || null,
        genre: formData.genre || 'Character',
        published_year: formData.published_year ? parseInt(formData.published_year) : null,
      };

      const { error } = await supabase
        .from('books')
        // @ts-expect-error - Supabase type mismatch
        .update(updateData)
        .eq('id', bookId);

      if (error) throw error;

      alert('저장되었습니다!');
      router.push('/admin');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
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
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? '저장 중...' : '저장'}
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
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="예: 2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">커버 이미지 URL</label>
                <input
                  type="text"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="이미지 URL"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">오디오 파일 URL</label>
                <input
                  type="text"
                  value={formData.audio_file}
                  onChange={(e) => setFormData({ ...formData, audio_file: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400"
                  placeholder="오디오 URL"
                />
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
