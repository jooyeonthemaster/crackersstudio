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
  const { books, isLoaded, addBook, updateBook, deleteBook, reorderBooks, resetToDefault, deployToSupabase } = useBookManagement({ mode: 'admin' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

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
      // 수정
      updateBook(bookData.id, bookData);
    } else {
      // 추가
      addBook(bookData);
    }
    setEditingBook(null);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                  🎨 어드민 페이지
                </h1>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                  📝 DRAFT
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                드래그하여 순서 변경, 클릭하여 수정, X로 삭제 → 🚀 배포하기로 메인에 반영
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition-colors"
              >
                🏠 메인으로
              </Link>
              <button
                onClick={resetToDefault}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors"
              >
                🔄 초기화
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? '⏳ 배포 중...' : '🚀 배포하기'}
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white font-bold rounded-full shadow-lg transition-all"
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
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </motion.div>
      </div>

      {/* 모달 */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSave}
        editBook={editingBook}
      />
    </div>
  );
}

