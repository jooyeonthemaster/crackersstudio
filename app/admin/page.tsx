'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useBookManagement } from '@/hooks/useBookManagement';
import { AdminBookCard } from '@/components/admin/AdminBookCard';
import { BookFormModal } from '@/components/admin/BookFormModal';
import { Book } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const { books, isLoaded, addBook, deleteBook, reorderBooks, resetToDefault, refreshFromSupabase, deployToSupabase } = useBookManagement({ mode: 'admin' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = books.findIndex((book) => book.id === active.id);
      const newIndex = books.findIndex((book) => book.id === over.id);
      const newBooks = arrayMove(books, oldIndex, newIndex);
      reorderBooks(newBooks);
    }
  };

  const handleSave = (bookData: Omit<Book, 'id'> | Book) => {
    if ('id' in bookData) {
      // 수정 (사용 안 함 - 별도 페이지로 이동)
    } else {
      // 추가
      addBook(bookData);
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleDeploy = async () => {
    if (confirm('현재 수정사항을 메인 페이지에 배포하시겠습니까?')) {
      setIsDeploying(true);
      const result = await deployToSupabase();
      setIsDeploying(false);

      if (result.success) {
        alert('✅ 배포 완료! 메인 페이지에 반영되었습니다!');
      } else {
        alert(`❌ 배포 실패: ${result.error}`);
      }
    }
  };

  const handleRefreshFromSupabase = async () => {
    if (confirm('Supabase에서 최신 데이터를 불러옵니다. 현재 로컬 수정사항이 있다면 덮어씌워집니다. 계속하시겠습니까?')) {
      setIsRefreshing(true);
      const result = await refreshFromSupabase();
      setIsRefreshing(false);

      if (result.success) {
        alert(`✅ 새로고침 완료! ${result.count}개의 카드를 불러왔습니다.`);
      } else {
        alert(`❌ 새로고침 실패: ${result.error}`);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl font-bold text-gray-700">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      {/* 헤더 */}
      <div className="bg-white border-b-4 border-yellow-300 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* 상단: 제목 + 메인으로 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                🎨 어드민 페이지
              </h1>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                📝 DRAFT
              </span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition-colors text-sm"
            >
              🏠 메인으로
            </Link>
          </div>

          {/* 하단: 작업 버튼들 */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-gray-500 mr-2">
              드래그로 순서 변경 · 클릭하여 수정 · X로 삭제
            </p>
            <div className="flex flex-wrap gap-2 ml-auto">
              <button
                onClick={handleRefreshFromSupabase}
                disabled={isRefreshing}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {isRefreshing ? '⏳ 불러오는 중...' : '☁️ DB 동기화'}
              </button>
              <button
                onClick={resetToDefault}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors text-sm whitespace-nowrap"
              >
                🔄 초기화
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {isDeploying ? '⏳ 배포 중...' : '🚀 배포하기'}
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white font-bold rounded-full shadow-lg transition-all text-sm whitespace-nowrap"
              >
                ➕ 새 카드 추가
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 border-3 border-yellow-200 shadow-lg">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold text-gray-900">{books.length}</div>
              <div className="text-sm text-gray-600">총 카드 수</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border-3 border-green-200 shadow-lg">
              <div className="text-4xl mb-2">🎵</div>
              <div className="text-3xl font-bold text-gray-900">{books.length}</div>
              <div className="text-sm text-gray-600">음성 파일 수</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border-3 border-blue-200 shadow-lg">
              <div className="text-4xl mb-2">✨</div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">관리 완료</div>
            </div>
          </div>

          {/* 카드 그리드 */}
          {books.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <div className="text-xl font-bold text-gray-700 mb-4">
                카드가 없습니다
              </div>
              <button
                onClick={handleAdd}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white font-bold rounded-full shadow-lg transition-all"
              >
                ➕ 첫 카드 추가하기
              </button>
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={books.map(book => book.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {books.map((book) => (
                    <AdminBookCard
                      key={book.id}
                      book={book}
                      onDelete={deleteBook}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </motion.div>
      </div>

      {/* 모달 (새 카드 추가용만 사용) */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editBook={null}
      />
    </div>
  );
}

