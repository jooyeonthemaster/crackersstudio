'use client';

import { Book } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminBookCardProps {
  book: Book;
  onDelete: (id: number) => void;
  onEdit: (book: Book) => void;
}

export function AdminBookCard({ book, onDelete, onEdit }: AdminBookCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="relative group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-2 cursor-grab active:cursor-grabbing hover:bg-yellow-100 transition-colors shadow-lg"
      >
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>

      {/* 삭제 버튼 */}
      <motion.button
        onClick={() => onDelete(book.id)}
        className="absolute top-2 right-2 z-30 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ✕
      </motion.button>

      {/* 편집 버튼 */}
      <motion.button
        onClick={() => onEdit(book)}
        className="absolute top-12 right-2 z-30 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ✏️
      </motion.button>

      {/* 카드 본체 */}
      <div className="bg-white rounded-[1.5rem] border-3 border-yellow-200 overflow-hidden shadow-xl hover:border-yellow-400 hover:shadow-2xl transition-all">
        {/* 이미지 */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* 정보 */}
        <div className="p-4 bg-gradient-to-b from-white to-yellow-50 border-t-2 border-yellow-100">
          <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight text-center truncate">
            {book.title}
          </h3>
          <div className="text-xs text-gray-600 text-center truncate">
            {book.author}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center truncate">
            ID: {book.id}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


