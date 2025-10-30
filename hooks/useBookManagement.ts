'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types';
import { books as initialBooks } from '@/lib/books';
import { supabase, fetchBooks, createBook as createBookDB, updateBook as updateBookDB, deleteBook as deleteBookDB, reorderBooks as reorderBooksDB } from '@/lib/supabase';

const STORAGE_KEY = 'crackers_studio_books_draft';

interface UseBookManagementOptions {
  mode?: 'admin' | 'public'; // admin: localStorage, public: Supabase
}

export function useBookManagement({ mode = 'admin' }: UseBookManagementOptions = {}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadBooks = async () => {
      if (mode === 'public') {
        // 메인 페이지: Supabase에서 로드
        const supabaseBooks = await fetchBooks();
        setBooks(supabaseBooks);
      } else {
        // Admin 페이지: localStorage에서 로드 (Draft)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setBooks(JSON.parse(stored));
          } catch (error) {
            console.error('Failed to load books:', error);
            // localStorage 실패 시 Supabase에서 로드
            const supabaseBooks = await fetchBooks();
            setBooks(supabaseBooks);
          }
        } else {
          // localStorage 없으면 Supabase에서 로드
          const supabaseBooks = await fetchBooks();
          setBooks(supabaseBooks);
        }
      }
      setIsLoaded(true);
    };

    loadBooks();
  }, [mode]);

  // 로컬 스토리지에 저장 (Draft)
  const saveToStorage = (newBooks: Book[]) => {
    if (mode === 'admin') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
    }
    setBooks(newBooks);
  };

  // 카드 추가
  const addBook = (book: Omit<Book, 'id'>) => {
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const newBook: Book = {
      ...book,
      id: newId,
    };
    saveToStorage([...books, newBook]);
  };

  // 카드 수정
  const updateBook = (id: number, updates: Partial<Book>) => {
    const newBooks = books.map(book =>
      book.id === id ? { ...book, ...updates } : book
    );
    saveToStorage(newBooks);
  };

  // 카드 삭제
  const deleteBook = (id: number) => {
    const newBooks = books.filter(book => book.id !== id);
    saveToStorage(newBooks);
  };

  // 순서 변경
  const reorderBooks = (newBooks: Book[]) => {
    saveToStorage(newBooks);
  };

  // 초기 데이터로 리셋
  const resetToDefault = () => {
    saveToStorage(initialBooks);
  };

  // Supabase에 배포 (Admin 전용) - URL 유지를 위해 UPDATE 방식으로 변경!
  const deployToSupabase = async () => {
    if (mode !== 'admin') {
      return { success: false, error: 'Deploy is only available in admin mode' };
    }

    try {
      // 1. 기존 Supabase 책들을 Map으로 저장
      const existingBooks = await fetchBooks();
      const existingBooksMap = new Map(existingBooks.map(b => [b.id, b]));

      // 2. localStorage의 책들을 순회하면서 UPDATE 또는 INSERT
      for (let i = 0; i < books.length; i++) {
        const book = books[i];

        if (existingBooksMap.has(book.id)) {
          // 기존 책이면 UPDATE (ID 유지! → URL 유지!)
          const result = await updateBookDB(book.id, {
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            audioFile: book.audioFile,
            description: book.description,
            content: book.content,
            genre: book.genre,
            publishedYear: book.publishedYear,
            display_order: i + 1,
          });

          if (!result.success) {
            console.error('Failed to update book:', book.id, result.error);
            return { success: false, error: `Failed to update ${book.title}: ${result.error}` };
          }

          existingBooksMap.delete(book.id); // 처리 완료 표시
        } else {
          // 새 책이면 INSERT (새 ID 자동 생성)
          const result = await createBookDB({
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            audioFile: book.audioFile,
            description: book.description,
            content: book.content,
            genre: book.genre,
            publishedYear: book.publishedYear,
          });

          if (result.success && result.data) {
            // display_order 설정
            await updateBookDB(result.data.id, { display_order: i + 1 });
          } else {
            console.error('Failed to create book:', book.title, result.error);
            return { success: false, error: `Failed to create ${book.title}: ${result.error}` };
          }
        }
      }

      // 3. localStorage에 없는 책들은 Supabase에서 삭제
      for (const [id] of existingBooksMap) {
        const result = await deleteBookDB(id);
        if (!result.success) {
          console.error('Failed to delete book:', id, result.error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Deploy error:', error);
      return { success: false, error: String(error) };
    }
  };

  return {
    books,
    isLoaded,
    addBook,
    updateBook,
    deleteBook,
    reorderBooks,
    resetToDefault,
    deployToSupabase,
  };
}

