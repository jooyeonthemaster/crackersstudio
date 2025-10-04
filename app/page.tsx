'use client';

import { BookGrid } from '@/components/BookGrid';
import { useBookManagement } from '@/hooks/useBookManagement';

export default function HomePage() {
  const { books, isLoaded } = useBookManagement({ mode: 'public' });

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
    <main className="min-h-screen">
      <BookGrid books={books} />
    </main>
  );
}
